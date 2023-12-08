<template>
    <div id="title">
      <h1>輸入點數資料</h1>      
    </div>
    <div id="alert">
      <h2>&nbsp;用戶資訊</h2>
      <h2>&nbsp;User:&nbsp;{{ querydata }}</h2>
      <input type="hidden" v-model="querydata"  >
      <br>
      <div class="pointdisplay"><div class="point"><img src="../assets/ShopPoint.png" alt="點數" />{{point}}</div></div>
      <h4>(可折抵<span id="mark-money">{{xpoint}}</span>元)</h4>
    </div>
    <form>
    <div id="int">
      
      <div id="input">
        <div class="input-heading">輸入<span id="mark-input">原消費</span>金額<span id="notice">(必填)</span></div>
      
      <input v-model="ConsumptionAmount" type="text" id="text">
      <br>
      <br>
      <div class="input-heading">輸入<span id="mark-input">折扣</span>金額<span id="notice">(選填)</span></div>
            <input v-model="DiscountAmount" type="text" id="text">
      </div>
    </div>
      <br>
      <input v-on:click.prevent="submitForm" type="button" value="送出" id="submit">
    </form>
    <FooterIcon />
  </template>
  
  <script>
  import { db} from "../config/firebaseConfig.js";
  import FooterIcon from '../components/FooterIcon.vue';
  import firebase from 'firebase/compat/app';
  export default {
  name: 'ProductsPage',
  components: {
    FooterIcon
  },
  data() {
    return {
      querydata: '',
      ConsumptionAmount: 0,
      DiscountAmount: 0,
      currentUser: '',
      currentUserLoaded: false, // 新增一个標記来表示用户數據是否加载完成
      point:null,
      xpoint:null,//折抵點數
      givepoint:null,
    }
  },
  methods: {
    getQuerydata() {
      this.querydata = this.$route.query.data;
    },
    submitForm() {
      const router = this.$router;

      let errorMessage = "";

 // 驗證 DiscountAmount 是否大於 mark-money
    if (this.DiscountAmount > parseInt(document.getElementById("mark-money").textContent)) {
      errorMessage = "請滿足：折扣金額≦可折抵金額\n";
    }

  // 驗證 ConsumptionAmount 是否小於 DiscountAmount
    if (parseInt(this.ConsumptionAmount) < parseInt(this.DiscountAmount)) {
      errorMessage += "請滿足：原消費金額≧折扣金額\n";
    }

    console.log("DiscountAmount:", this.DiscountAmount);
    console.log("ConsumptionAmount:", this.ConsumptionAmount);
    console.log("errorMessage:", errorMessage);


    if (errorMessage !== "") {
      alert(errorMessage);
      return; // 不繼續执行提交操作
    }

      // 確保用戶數據已加載後再執行 post 方法
      if (this.currentUserLoaded) {
        this.post();
        router.push('/DistributionRecord');
      }
    },
async post() {
      const now = new Date();
      const nowTimestamp=firebase.firestore.Timestamp.fromDate(now);
      console.log('ShopName:', this.currentUser['shopName']);
      console.log('this.currentUser:', this.currentUser);
      const data={
        member: this.querydata,
        AssignPoint: (this.ConsumptionAmount - this.DiscountAmount) / 100,
        currentTime: nowTimestamp,
        ShopName: this.currentUser['shopName'],
      }
      await db.collection("PointAssign").add(data);
      console.log('點數紀錄輸入成功');
      db.collection("member")
        .doc(this.querydata)
        .collection("cards")
        .where("cardname", "==", this.currentUser['shopName'])
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            // 字段存在
            db.collection("member").doc(this.querydata).collection("cards").doc(this.currentUser['shopName']).update({
              point:this.point+(this.ConsumptionAmount - this.DiscountAmount) / 100,
            })
            console.log(this.currentUser['shopName']+ "存在");
          } else {
            // 字段不存在
            let URL="";
            db.collection("shops").doc(this.currentUser['shopName']).get().then((doc) => {
              if (doc.exists) {
                URL=doc.data().imageUrl;
                console.log(URL);
                const carddata={
                  cardname:this.currentUser['shopName'],
                  image:URL,
                  point:(this.ConsumptionAmount - this.DiscountAmount) / 100,
                }
                db.collection("member").doc(this.querydata).collection("cards").doc(this.currentUser['shopName']).set(carddata);
                console.log("已新建"+this.currentUser['shopName']+"集點卡");
                  } else {
                    console.error("點數不存在");
                }
            })
            .catch((error) => {
              console.error("獲取卡片時出錯：", error);
            });
            
          }
        })
        .catch((error) => {
          console.error("檢查字段時發生錯誤：", error);
        });
      db.collection("shops").doc(this.currentUser['shopName']).get().then((doc) => {
              if (doc.exists) {
                this.givepoint = doc.data().ShopGivePoint;
                console.log("givepoint:"+this.givepoint);
                const a=this.givepoint+(this.ConsumptionAmount - this.DiscountAmount)/100;
                console.log("增加點數"+(this.ConsumptionAmount - this.DiscountAmount)/100)
                console.log("a:"+a);
                db.collection("shops").doc(this.currentUser['shopName']).update({
                    ShopGivePoint:a,
                  });
              } else {
                console.error("點數不存在");
              }
            })
            .catch((error) => {
              console.error("獲取卡片時出錯：", error);
            });
      },
    
  },
  created() {
    this.getQuerydata();
    const user = localStorage.getItem('shop');
    if (user) {
      // 将JSON字符串转换为对象
      this.currentUser = JSON.parse(user);
      this.currentUserLoaded = true; // 标志用户数据已加载
    }else{
      this.$router.push({path:'/Login'});
      alert("登入後才能使用喔");
    }
    db.collection("member").doc(this.querydata).collection("cards").doc(this.currentUser['shopName']).get().then((doc) => {
              if (doc.exists) {
                this.point = doc.data().point;
                this.pointLoaded = true;
                this.xpoint=Math.floor(this.point);
                console.log("xpoint:"+this.xpoint);
              } else {
                this.point=0;
                this.xpoint=0;
                console.error("點數不存在");
              }
            })
            .catch((error) => {
              console.error("獲取卡片時出錯：", error);
            });
  },
  mounted(){
    
  }
};

  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #title{
    background-color: #464E2E;
    color: white;
    width: 100%;
    text-align: center;
    position: absolute;
    top:0;
    left: 0;
    display: block;
  }
  #alert {
    background-color: #FAF0E4;
    width: 80%;
    margin: 30% auto 0;
    padding: 10px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .pointdisplay {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -20px;
    margin-bottom: 10px;
  }
  .point {
    display: inline-flex;
    align-items: center;
    font-size: 50px;
    font-weight: bold;
    color: 	#3D7878;
  }

  .point img {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
  h3{
    margin-top: -10px;
    text-align: center;
    margin-right: 15%;
    margin-bottom: 15px;
  }
  h4{
    font-size: 25px;
    margin: 0 auto 20px;
  }

  #mark-money {
    font-size: 35px; 
    color: 	#3D7878;
    font-weight: bold;
  }

  #int {
    width: 80%;
    margin: 0 auto 20px;
    text-align: center;
  }

  #input {
    margin: 30px auto 0;
    font-size: 20px;
  }
  
  .input-heading {
    font-size: 20px;
    margin-bottom: 10px;
  }

  #mark-input {
    font-size: 25px; 
    color: #0066CC;
    font-weight: bold;
  }

  #notice {
    font-size: 20px;
    color: red;
    margin-left: 5px;
  }
  #text {
    width: 200px;
    font-size: 30px;
    text-align: center;
  }
  #submit {
    margin: 15px auto 100px; 
    border-radius: 20px;
    background-color:#ed8080;
    color:black;
    border-color: lightgray;
    border-style: hidden;
    font-size: 20px;
    font-weight: bold;
    height: 50px;
    width: 100px;
    display: block;
  }
  
    .point img {
    position:relative;
    width: 40px;
    height: 40px;
    padding-top: 0px;
  }


  </style>
  