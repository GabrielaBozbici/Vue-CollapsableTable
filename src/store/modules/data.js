import * as tableData from '../../../src/data.json'

const state = {
  tableInfo: tableData
};

const getters = {
  allTableInfo: (state) => state.tableInfo
  
};

const actions = {
  fetchTableInfo({ commit }) {
    commit('setTableData', tableData.default);
  },

  deleteData({commit}, indexPath){
    commit('removeData', indexPath);
    console.log('path:', indexPath)
  }
};

const mutations = {
  setTableData: (state, info) => (state.tableInfo = info),
  
  removeData: (state, info) => {
    switch(info.length){
      case 3: {
          console.log(' length is 3!!!', info);
          if (state.tableInfo[info[0]].kids.has_relatives.records[info[1]].kids.has_phone.records.length === 1) {
            state.tableInfo[info[0]].kids.has_relatives.records[info[1]].kids.has_phone.records = [];
          } else {
            state.tableInfo[info[0]].kids.has_relatives.records[info[1]].kids.has_phone.records.splice(info[2], 1);
          }
          break;
      }
      case 2: {
        if (state.tableInfo[info[0]].kids.has_relatives.records.length === 1) {
          state.tableInfo[info[0]].kids.has_relatives.records = [];
        } else {
          state.tableInfo[info[0]].kids.has_relatives.records.splice(info[1], 1)
        }
        break;
      }
      case 1: {
        state.tableInfo.splice(info[0], 1)
        break;
      }
      default: {
        break;
      }
    }
    
    
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}


