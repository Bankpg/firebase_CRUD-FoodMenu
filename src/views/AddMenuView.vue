<template>
  <v-row class="ga-5 ma-5 justify-center">
    <!--Form-->
    <v-col cols="4" class="rounded-xl d-flex flex-column" style=" background-color: white; min-width: 300px;">
      <v-img
        src="https://img.freepik.com/free-vector/female-chef-concept-illustration_114360-15290.jpg?w=1060&t=st=1707757746~exp=1707758346~hmac=c047c74a800dd0f6c7b134dc3ca02abff59f0693c74e808e3981f663938bdd78">
      </v-img>
      <v-form v-model="menu.form" class="d-flex flex-column">
        <v-text-field label="Food" type="text" :rules="[rules.required]" v-model="menu.food"></v-text-field>
        <v-text-field label="Price" prefix="฿" type="number" oninput="if(this.value < 0) this.value = null;"
          :rules="[rules.required, rules.price_check]" v-model="menu.price"></v-text-field>
        <v-btn class="rounded-xl" prepend-icon="mdi-check" color="blue" :disabled="!menu.form" @click="add()">Add to
          menu</v-btn>
      </v-form>
    </v-col>

    <!--Show data-->
    <v-col class="rounded-xl pa-0"
      style=" height: 90vh; background-color: rgba(255, 255, 255, 0.778); min-width: 300px; max-width: 600px; overflow: scroll;">
      <!--Top-->
      <div class="text-center"
        style="z-index: 100; top: 0%; position: sticky; background-color: rgba(0, 145, 255, 0.561); backdrop-filter: blur(10px); height: 50px; ">
        <h1 style="font-weight: bolder;">MENU</h1>
      </div>
      <v-form v-model="update_input.form">
        <v-card v-for="(food, index) in food_doc" key="index" class="d-flex rounded-xl ma-4 text-center border"
          height="100px">
          <v-row class="ma-0  align-center" style="font-size: 20px;  text-wrap: wrap;">
            <v-col cols="2">
              <v-icon v-if="food.id !== editID" size="x-large">mdi-silverware-fork-knife</v-icon>
              <v-icon v-else size="x-large"
                style="position: absolute; top: 30%; left: 5%;">mdi-notebook-edit-outline</v-icon>
            </v-col>
            <!--Fied-->
            <v-col cols="7" class="pr-0">
              <v-row v-if="food.id !== editID" class="justify-space-between ma-0">
                <p>{{ food.data.food }}</p>
                <p style="text-align: end;">{{ food.data.price }} ฿</p>
              </v-row>
              <!--Edit-->
              <v-row v-else class="justify-space-between ma-0 pt-2">
                <v-text-field variant="outlined" type="text" v-model="update_input.food" :placeholder="food.data.food"
                  :rules="[rules.character_check]">
                </v-text-field>
                <v-text-field style="width: 10px;" variant="outlined" type="number" v-model="update_input.price"
                  :rules="[rules.character_check]" :placeholder="food.data.price + '฿'">
                </v-text-field>
              </v-row>
            </v-col>

            <v-spacer></v-spacer>
            <!--Button-->
            <v-col cols="3" class="pa-0 ">
              <v-row v-if="food.id !== editID" class="d-flex justify-end pr-1">
                <v-btn icon="mdi-pencil-outline" color="blue" variant="plain" @click="edit(food.id)"></v-btn>
                <!--Confirm Del-->
                <v-dialog width="300">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-trash-can-outline" color="red" variant="plain"> </v-btn>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card title="Confirm" class="align-center">
                      <v-card-text>ต้องการลบรายการนี้หรือไม่ ?</v-card-text>
                      <v-card-actions>
                        <v-btn icon="mdi-check" color="green" variant="plain"
                          @click="del(food.id, index), isActive.value = false"></v-btn>
                        <v-btn icon="mdi-cancel" color="red" @click="isActive.value = false"></v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-row>

              <v-row v-else class="d-flex justify-end pr-1">
                <v-btn icon="mdi-content-save-outline" color="green" variant="plain" :disabled="!update_input.form"
                  @click="update(food.id)"></v-btn>
                <v-btn icon="mdi-cancel" color="red" variant="plain" @click="cancel_edit()"></v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-form>

    </v-col>
  </v-row>
</template>

<script setup>
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { ref, onMounted } from 'vue';
import { db } from "../firebase";
import { collection, addDoc, getDocs, getCountFromServer, deleteDoc, doc, onSnapshot, updateDoc, count } from "firebase/firestore";
//onMounted(() => read());//Run function read() เมื่อเริ่ม
///ที่อยู่ของ database
const menuRef = collection(db, "food_menu")
///Doc////
const food_doc = ref([])
///Input////
const menu = ref({
  form: false,
  food: null,
  price: null
})
const rules = {
  required: value => !!value || 'โปรดกรอกข้อมูล',

  character_check: function (value) {
    var specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialCharacters.test(value)) {
      return 'ห้ามมีอักษรพิเศษ'
    } else {
      return true
    }
  }
}
///Alert////
const alert_add = () => {
  Swal.fire({
    icon: 'success',
    showConfirmButton: false,
    timer: 1500,
    title: 'เพิ่มรายการสำเร็จ'
  })
}
const alert_del = () => {
  Swal.fire({
    icon: 'success',
    showConfirmButton: false,
    timer: 1500,
    title: 'ลบรายการสำเร็จ'
  })
}
const alert_err = () => {
  Swal.fire({
    icon: 'error',
    showConfirmButton: false,
    timer: 1500,
    title: 'Console.log'
  })
}

///// Add menu //////
const add = async () => {
  console.log("Click Add")
  await addDoc(menuRef, {
    food: menu.value.food,
    price: Number(menu.value.price)
  }
  ).then((res) => { //เมื่อทำสำเร็จจะให้ทำอะไร
    console.log('Add Success :', res)
    // reset input
    menu.value.food = null
    menu.value.price = null
    menu.value.form = false
    alert_add()
    //read()
  }).catch((err) => {//error ให้ทำอะไร
    console.log(err)
    alert_err()
  })
}

///Del///
const del = async (id, index) => {
  console.log("Click del")
  await deleteDoc(doc(db, 'food_menu', id))
  console.log('Delete document with ID:', id)
  //food_doc.value.splice(index, 1)
  alert_del()
}

//Edit
const editID = ref()
const edit = (id) => {
  update_input.value.food = null
  update_input.value.price = null
  editID.value = id
}
//CancelEdit
const cancel_edit = () => {
  update_input.value.food = null
  update_input.value.price = null
  editID.value = null
}

/////Save & Update///
const update_input = ref({
  form: false,
  food: null,
  price: null
})
const update = async (id) => {
  console.log('Click update')
  if (update_input.value.food !== null && update_input.value.food !== '') {
    await updateDoc(doc(menuRef, id), {
      food: update_input.value.food
    })
  } if (update_input.value.price !== null && update_input.value.price !== '') {
    await updateDoc(doc(menuRef, id), {
      price: Number(update_input.value.price)
    })
  }
  update_input.value.food = null
  update_input.value.price = null
  editID.value = null
}




///loadMenu/////
const read = async () => {
  food_doc.value = [] //Clear array ใน food_doc เพื่อไม่ให้Push ข้อมูลซำ้
  const querySnapshot = await getDocs(menuRef);
  querySnapshot.forEach((doc) => {//loop ทุกตัวใน db food_menu เก็บค่าเข้า doc
    //console.log(doc.id, " => ", doc.data()); 
    const new_doc = ref({ id: doc.id, data: doc.data() }) //เอาแต่ละตัวเข้า new_doc
    food_doc.value.push(new_doc.value) //push เข้า array list food_doc
  });
  console.log('read', food_doc.value)
}

//loadRealTime/////   
const unsub = onSnapshot(menuRef, (snapshot) => {
  food_doc.value = [] //Clear array ใน food_doc เพื่อไม่ให้Push ข้อมูลซำ้
  snapshot.forEach((doc) => {//loop ทุกตัวใน db food_menu เก็บค่าเข้า doc
    //console.log(doc.id, " => ", doc.data()); 
    const new_doc = ref({ 
      id: doc.id, 
      data: doc.data() 
    }) //เอาแต่ละตัวเข้า new_doc
    food_doc.value.push(new_doc.value) //push เข้า array list food_doc
  });
})

</script>
<style scoped>
.v-row {
  margin: 0;
}
</style>                                                                                                                                             