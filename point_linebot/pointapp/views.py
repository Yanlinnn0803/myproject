from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
import firebase_admin
from firebase_admin import credentials, firestore
from linebot import LineBotApi, WebhookParser
from linebot.exceptions import InvalidSignatureError, LineBotApiError
from linebot.models import MessageEvent, TextSendMessage

# Line Bot API
line_bot_api = LineBotApi(settings.LINE_CHANNEL_ACCESS_TOKEN)
parser = WebhookParser(settings.LINE_CHANNEL_SECRET)

# 初始化 Firebase
cred = credentials.Certificate('pointapp/serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# 取得 "PointAssign, member" 集合的參考
point_assign_ref = db.collection("PointAssign")
member_ref = db.collection("member")


# Line Bot Callback
@csrf_exempt
def callback(request):
    if request.method == 'POST':
        signature = request.META['HTTP_X_LINE_SIGNATURE']
        body = request.body.decode('utf-8')
        try:
            events = parser.parse(body, signature)
        except InvalidSignatureError:
            return HttpResponseForbidden()
        except LineBotApiError:
            return HttpResponseBadRequest()

        for event in events:
            if isinstance(event, MessageEvent):
                if event.message.text == '我的集點卡':
                    sendCards(event)

        return HttpResponse()
    else:
        return HttpResponseBadRequest()
    

def sendCards(event):
    # 獲取 Line ID
    line_id = event.source.user_id
    
    # 取得使用者的資訊
    member_ref = db.collection("member")
    user_query = member_ref.where("lineid", "==", line_id)
    user_documents = user_query.stream()
    
    # 準備回覆訊息
    reply_message = "您的集點卡：\n"
    message = ''
    #point_cards = []

    for user_document in user_documents:
        # 取得使用者的 cards 集合
        cards_ref = user_document.reference.collection('cards')
        cards_query_snapshot = cards_ref.get()

        for card_doc in cards_query_snapshot:
            # 處理每張卡的資訊
            card_data = card_doc.to_dict()

            # 提取卡的欄位，這裡使用 cardname 和 point 作為例子，你可以根據實際情況修改
            cardname = card_data.get('cardname')
            point = card_data.get('point')
            message += f"《{cardname}》 集點卡目前擁有 {point} 點數\n"
        

    # 使用 LineBot 回覆訊息
    line_bot_api.reply_message(event.reply_token, TextSendMessage(text=reply_message + message))
    
'''   
# 定義監聽回調函數，處理新增文檔事件
def on_snapshot(doc_snapshot, changes, read_time):
    for change in changes:
        # 如果是新增的文檔
        if change.type.name == 'ADDED':
            # 取得文檔內容轉為字典
            doc_data = change.document.to_dict()

            # 檢查 "AssignPoint"、"ShopName" 和 "member" 是否存在
            if doc_data and "AssignPoint" in doc_data and "ShopName" in doc_data and "member" in doc_data:
                # 獲取 AssignPoint、ShopName 和 member
                assign_point = doc_data.get("AssignPoint")
                shop_name = doc_data.get("ShopName")
                member_data = doc_data.get("member")

                # 直接使用 member_data 作為 member_id
                member_id = member_data

                # 根據 member_id 查詢 "members" 集合
                member_doc = member_ref.document(member_id).get()

                if member_doc.exists:
                    # 取得對應的 "lineid"
                    lineid = member_doc.get("lineid")
                    if lineid:
                        line_bot_api.push_message(lineid, TextSendMessage(text=f"您的 {shop_name} 的集點卡，更新 {assign_point} 點"))
                        print(f"event: {change.document.id},AssignPoint: {assign_point}, ShopName: {shop_name}, Member ID: {member_id}, Line ID: {lineid}")
                    else:
                        print(f"event: {change.document.id},資料庫測試之電話號碼")
                else:
                    print(f"event: {change.document.id},Member document with ID {member_id} does not exist")
            else:
                # 如果缺少任一欄位，印出整個文檔資料以供檢查
                print(f"Missing 'AssignPoint', 'ShopName', or 'member' in the document {change.document.id} data: {doc_data}")

# 設定監聽，當有新增文檔時觸發 on_snapshot 函數
point_assign_watch = point_assign_ref.on_snapshot(on_snapshot)

# 讓程式一直處於監聽狀態
while True:
    pass
'''
