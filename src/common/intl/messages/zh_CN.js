export default {
  app: {
    footer: {
      madeByHtml: ''
    },
    links: {
      firebase: 'Firebase',
      home: '贷后管理系统',
      login: 'Login',
      me: 'Me',
      todos: 'Todos',
      debtors: '借款人管理'
    }
  },
  auth: {
    form: {
      button: {
        login: 'Login',
        signup: 'Sign up'
      },
      hint: 'Hint: pass1',
      legend: 'Classic XMLHttpRequest Login',
      placeholder: {
        email: 'your@email.com',
        password: 'password'
      },
      wrongPassword: 'Wrong password.'
    },
    logout: {
      button: 'Logout'
    },
    login: {
      title: 'Login'
    },
    validation: {
      email: 'Email address is not valid.',
      password: 'Password must contain at least {minLength} characters.',
      required: `Please fill out {prop, select,
        email {email}
        password {password}
        other {'{prop}'}
      }.`
    }
  },
  home: {
    // // TODO: Android text.
    // androidInfoText: ``,
    infoHtml: '',
    iosInfoText: `
      Este.js dev stack
      Press CMD+R to reload
      Press CMD+D for debug menu
    `,
    title: '贷后管理系统',
    toCheck: {
      andMuchMore: 'And much more :-)',
      h2: 'Things to Check',
      isomorphicPage: 'Isomorphic page',
      // Localized ordered list.
      list: [
        'Server rendering',
        'Hot reloading',
        'Performance and size of production build (<code>gulp -p</code>)'
      ]
    }
  },
  me: {
    title: 'Me',
    welcome: 'Hi {email}. This is your secret page.'
  },
  notFound: {
    continueMessage: 'Continue here please.',
    header: 'This page isn\'t available',
    message: 'The link may be broken, or the page may have been removed.',
    title: 'Page Not Found'
  },
  todos: {
    add100: 'Add 100 Todos',
    clearAll: 'Clear All',
    clearCompleted: 'Clear Completed',
    empty: 'It\'s rather empty here...',
    leftList: `{size, plural,
      =0 {Nothing, enjoy}
      one {You are almost done}
      other {You have {size} tasks to go}
    }`,
    newTodoPlaceholder: 'What needs to be done?',
    title: 'Todos'
  },
  debtors: {
    headerTitle: '借款人搜索',
    idCard: '身分证号',
    maritalStatus: '婚姻状态',
    name: '姓名',
    originatedAgreementNo: '原贷款合同号',
    search: '搜索',
    debtorDetail: '借款人详细'
  },
  loans: {
    headerTitle: '贷款列表',
    appliedAt: '申请日期',
    issuedAt: '贷款日期',
    terms: '期限',
    delinquentAt: '逾期日期',
    amount: '贷款金额',
    apr: '年化利率',
    transferredAt: '转让日期',
    managementFeeRate: '管理费率',
    handlingFeeRate: '手续费率',
    lateFeeRate: '滞纳金费率',
    penaltyFeeRate: '违约金费率',
    collectablePrincipal: '本金应收',
    collectableInterest: '利息应收',
    collectableMgmtFee: '管理费应收',
    collectableHandlingFee: '手续费应收',
    collectableLateFee: '滞纳金应收',
    collectablePenaltyFee: '违约金应收',
    repaidTerms: '已还期数',
    remainingTerms: '剩馀期数',
    originatedAgreementNo: '原贷款合同号',
    originatedLoanProcessingBranch: '原贷款分行',
    repaymentPlan: '还款计划',
    add: '新增',
    confirmNewRepaymentPlanTitle: '新增还款计划?',
    confirmNewRepaymentPlanContent: '是否要新增还款计划?',
  },
  confirmDialog: {
    cancel: '取消',
    confirm: '确定'
  },
  repayments: {
    repaymentPlan: '还款计划',
    repayments: '还款计划详细',
    principal: '本金',
    apr: '年利率',
    servicingFeeRate: '服务费率',
    managementFeeRate: '管理费率',
    lateFeeRate: '',
    penaltyFeeRate: '',
    terms: '期限',
    startedAt: '首次还款日',
    endedAt: '结束日期',
    interest: '利息',
    servicingFee: '服务费',
    managementFee: '管理费',
    lateFee: '',
    penaltyFee: '',
    term: '期数',
    expectedRepaidAt: '预期还款日',
    repaymentStatus: '还款状态',
    repaidAt: null,
  },
  newRepaymentPlanDialog: {
    cancel: '取消',
    submit: '提交',
    generateRepayments: '生成',
    newRepaymentPlanTitle: '新增还款计划',
    amount: '还款总金额',
    terms: '还款总期数',
    repayDate: '首次还款日期',
    term: '期数',
    expectedRepaidAt: '预期还款日',
    repaymentAmt: '还款金额'  ,
    ok: '确定',
  },
  profile: {
    title: 'Profile'
  },
  settings: {
    title: 'Settings'
  }
};
