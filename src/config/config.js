const CONFIG = {
  colorMap: {
    '#f69d9d': {
      textColor: '#ffffff',
      starColor: '#ffeab6'
    },
    '#ffeab6': {
      textColor: '#52616b',
      starColor: '#f69d9d'
    },
    '#a6e3e9':{
      textColor: '#52616b',
      starColor: '#71c9ce'
    },
    '#71c9ce':{
      textColor: '#52616b',
      starColor: '#a6e3e9'
    },
    '#3a9679': {
      textColor: '#ffffff',
      starColor: '#ffeab6'
    }, 
    '#ffcef3': {
      textColor: '#52616b',
      starColor: '#cabbe9'
    },
    '#cabbe9': {
      textColor: '#52616b',
      starColor: '#ffcef3'
    },
    'linear-gradient(to right, #fad0c4, #ffd1ff)': {
      textColor: '#52616b',
      starColor: '#ffffff'
    },
    'linear-gradient(to right, #a18cd1, #fbc2eb)': {
      textColor: '#52616b',
      starColor: '#ffffff'
    },
    'linear-gradient(to right, #fbc2eb, #a6c1ee)': {
      textColor: '#52616b',
      starColor: '#ffffff'
    },
    'linear-gradient(to right, #84fab0, #8fd3f4)': {
      textColor: '#52616b',
      starColor: '#ffffff'
    },
    'linear-gradient(to right, #fccb90, #d57eeb)': {
      textColor: '#52616b',
      starColor: '#ffffff'
    },
    'linear-gradient(to right, #e0c3fc, #8ec5fc)': {
      textColor: '#52616b',
      starColor: '#ffffff'
    },
    'linear-gradient(to right, #a8edea, #fed6e3)': {
      textColor: '#52616b',
      starColor: '#ffffff'
    },
    "":{
      
    }
  },
  holiday: [{
    name: '元旦',
    date: '01-01',
    dateType: "solar",    
    cycleType: 'year',
    status: 0,
  },{
    name: '情人节',
    date: '02-14',
    dateType: "solar",
    cycleType: 'year',
    status: 0,
  },{
    name: '劳动节',
    date: '05-01',
    dateType: "solar",
    cycleType: 'year',
    status: 0,
  },{
    name: '青年节',
    date: '05-04',
    dateType: "solar",
    cycleType: 'year',
    status: 0,
  },{
    name: '儿童节',
    date: '06-01',
    dateType: "solar",
    cycleType: 'year',
    status: 0,
  },{
    name: '国庆节',
    date: '10-01',
    dateType: "solar",
    cycleType: 'year',
    status: 0,
  },{
    name: '万圣夜',
    date: '10-31',
    dateType: "solar",
    cycleType: 'year',
    status: 0,
  },{
    name: '感恩节',
    date: '11-28',
    dateType: "solar",
    cycleType: 'year',
    status: 0,
  },{
    name: '平安夜',
    date: '12-24',
    dateType: "solar",
    cycleType: 'year',
    status: 0,
  },
  {
    name: '圣诞节',
    date: '12-24',
    dateType: "solar",
    cycleType: 'year',
    status: 0,
  }],

  cycleType: [{
    name: '每年',
    value: 'year'
  },{
    name: '每月',
    value: 'month'
  },{
    name: '无',
    value: 'none'
  }],

  cycleTypeMap:{
    'year': '每年',
    'month': '每月',
    'none': '无'
  },


  code: {
    success: 2000,

  }
}

export default CONFIG