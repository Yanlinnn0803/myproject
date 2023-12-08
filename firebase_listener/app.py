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
line_bot_api = LineBotApi('Kw9GWkhNON+/1aVU7uEE6g2NW4ebzQLhQBVdBdnMj1vb5ktE9TcdP+3ZPWtm3g6d8Oc2ncEXhvQuP13iobA4Ja/baHSPG45Eo1whkm29w3p40IyQpQh9smhrgX9sdOP72Yxru6CVHTF1jjkO6aid3gdB04t89/1O/w1cDnyilFU=')
parser = WebhookParser('c837e70c69cc3f120186d83d8415a6fb')

# 初始化 Firebase
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# 取得 "PointAssign, member" 集合的參考
point_assign_ref = db.collection("PointAssign")
member_ref = db.collection("member")

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
