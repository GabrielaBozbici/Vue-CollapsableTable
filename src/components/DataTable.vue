<template>
  <div>
   <h1>Hierarchy Table</h1>
    <table class="main table-border" v-if="allTableInfo.length">
      <thead class="mainHead">
        <tr>
          <th class="emptyCell"></th>
          <th v-for="(value, key, index) in allTableInfo[0].data" :key="index">{{key}}</th>
          <th class="emptyCell"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(rootElement, index) in allTableInfo">
          <tr :key="index" class="rootElem" @click="expand('root',index,$event)">
          <!-- down/right arrow-->
            <td v-if="rootElement.kids.has_relatives && rootElement.kids.has_relatives.records.length" 
                :key="allTableInfo.length + index"
                class="arrow">
              <i v-bind:class="[expanded.root === index ? 'fas fa-angle-down'  : 'fas fa-angle-right']"></i>
            </td>
            <td v-else :key="allTableInfo.length + index"></td>
            <!-- down/right arrow-->
            <td v-for="(value, key, index) in rootElement.data" :key="index">
              {{value}}
            </td>
            <td class="delete">
              <i class="fas fa-times" @click.prevent="deleteItem([index], $event)"></i>
            </td>  
          </tr>
          <tr 
            v-if="rootElement.kids && rootElement.kids.has_relatives 
              && rootElement.kids.has_relatives.records.length
              && expanded.root === index"
              
              :key="allTableInfo.length + index" 
              class="childElem">
            <td colspan="12">
              <!-- Innefficient, better to show static string? -->
              <h5 v-for="(val, k, index) in rootElement.kids" 
                  :key="index" 
                  class="uppercase">
                  {{k}}
              </h5>
              <table class="extend toRight table-border">
                <thead class="secondHead">
                  <tr>
                    <th></th>
                    <th v-for="(value, recordHeading, index) in rootElement.kids.has_relatives.records[0].data" 
                        :key="index">
                      {{recordHeading}}
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                <template v-for="(relativeElement, firstChildindex) in rootElement.kids.has_relatives.records">
                  <tr :key="firstChildindex" class="toRight relative" @click="expand('child',firstChildindex, $event)" >
                  <!-- sagetica -->
                    <td v-if="relativeElement.kids && relativeElement.kids.has_phone.records.length" 
                        :key="allTableInfo.length + firstChildindex"
                        class="arrow">
                      <i v-bind:class="[expanded.child === firstChildindex ? 'fas fa-angle-down'  : 'fas fa-angle-right']"></i>
                    </td>
                    <td v-else :key="allTableInfo.length + firstChildindex"></td>
                    <!-- down/right arrow-->
                    <td v-for="(value, key, index ) in relativeElement.data" 
                        :key="index">
                        {{value}}
                    </td>
                    <td class="delete">
                      <i class="fas fa-times" @click.prevent="deleteItem([index, firstChildindex], $event)"></i>
                    </td>  
                  </tr>
                  <tr v-if="relativeElement.kids 
                    && relativeElement.kids.has_phone 
                    && relativeElement.kids.has_phone.records.length
                    && expanded.child === firstChildindex" 
                    :key="rootElement.kids.has_relatives.records.length + firstChildindex" 
                    class="secondChildElem phoneTable">
                    <td colspan="12">
                      <!-- Innefficient, better to show static string? -->
                      <h5 v-for="(val, k, index) in relativeElement.kids" 
                          :key="index" 
                          class="uppercase">
                          {{k}}
                      </h5>
                      <table class="extend toRightInner table-border">
                        <thead class="thirdHead">
                          <tr>
                            <th v-for="(value, recordHeading, index) in relativeElement.kids.has_phone.records[0].data" :key="index">
                              {{recordHeading}}
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <template v-for="(phoneElement, thirdChildIndex) in relativeElement.kids.has_phone.records">
                            <tr :key="thirdChildIndex" class="relativePhone">
                              <td v-for="(value, key, index) in phoneElement.data" :key="index">
                                {{value}}
                              </td>
                              <td class="delete">
                                <i class="fas fa-times" @click.prevent="deleteItem([index, firstChildindex, thirdChildIndex], $event)"></i>
                              </td>  
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </template>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div v-if="!allTableInfo.length">
      <h2>
        <span><i>You have deleted all the data in the table!</i></span>  &#128512;
      </h2>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "DataTable",
  methods: {
    ...mapActions(['fetchTableInfo','deleteData']),
    expand: function(level, position, event) {
      event.stopPropagation();

      if(this.expanded[level] === position) {
        this.expanded[level] = null;
      } else {
        this.expanded[level] = position;
      }
      if(level === 'root') {
        this.expanded['child'] = null;
      }
    },
    deleteItem(indexPath, event){
      event.stopPropagation();
      this.deleteData(indexPath)
    }
  },
  data (){
    return {
      expanded: {
        root: null,
        child: null
      }
    }
  }, 
  computed: mapGetters(['allTableInfo']),
  created() {
  this.fetchTableInfo()
 },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
  padding: 20px 0;
}
table.main {
  margin: auto;
}
table.main .mainHead, .secondHead, .thirdHead {
  background-color: #E6E6FA;
}
.mainHead th, .secondHead th, .thirdHead th {
  padding: 10px;
}
.emptyCell {
  width: 1.5rem;
}
table td {
  padding: 10px 0 10px 30px;
  text-align: left;
}
.delete, .arrow {
  text-align: center;
  cursor: pointer;
}
h5 {
  margin-top: 0;
  padding-top: 15px;
}
.uppercase {
  text-transform: uppercase;
  text-align: left;
  margin-bottom: 5px;
}
.extend {
  width: 100%;
}
.toRight {
  padding-left: 40px;
}
.toRightInner {
  padding-left: 60px;
}
.rootElem {
  border-top: #b6b6de thin solid; 
  border-bottom: #ddd thin solid;
}
.table-border {
  border-collapse: collapse;
}
.childElem {
  margin-left: 20px;
}
.relative{
  border-top: #b6b6de thin solid; 
  border-bottom: #ddd thin solid;
}
.relativePhone {
  border-top: #b6b6de thin solid; 
  border-bottom: #ddd thin solid;
}
thead > tr {
  border-top: 1px solid #b6b6de;
}
</style>