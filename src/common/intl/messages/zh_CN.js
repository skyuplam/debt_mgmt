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
    loanDetail: '贷款详细',
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
    totalCollectableFee: '总费用应收',
    collectableMgmtFee: '管理费应收',
    collectableHandlingFee: '手续费应收',
    collectableLateFee: '滞纳金应收',
    collectablePenaltyFee: '违约金应收',
    placementCode: '委外代码',
    placementServicingFeeRate: '委外费率',
    placedAt: '委外日期',
    expectedRecalledAt: '预期回收日期',
    recalledAt: '委外回收日期',
    agency: '委外机构名称',
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
    repay: '还款',
    paid: '已还款',
    repayments: '还款计划详细',
    principal: '本金',
    repaymentAmt: '还款金额',
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
    repaymentPlanStatus1: '新还款计划',
    repaymentPlanStatus2: '还款中',
    repaymentPlanStatus3: '已取消',
    repaymentPlanStatus4: '过期',
    repaymentPlanStatus5: '结清',
    status: '状态',
    repaidAt: '还款于',
    action: '操作',
    confirmRepayment: '是否确定这笔还款?',
    repaymentStatus1: '新还款',
    repaymentStatus2: '过期',
    repaymentStatus3: '过期后还款',
    repaymentStatus4: '过期后部分还款',
    repaymentStatus5: '已还款',
    repaymentStatus6: '部份还款',
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
    repaymentAmt: '还款金额',
    ok: '确定',
    invalidRepaymentAmount: '还款总金额不正确'
  },
  repaymentDialog: {
    title: '请确认还款',
    cancel: '取消',
    term: '还款期数',
    confirm: '确认',
    repaidAt: '还款日期',
    expectedRepayAt: '预期还款日',
    repayAmount: '还款金额',
    paidInFull: '是否结清',
  },
  contacts: {
    contacts: '联络电话',
    addresses: '联络地址',
    addNewContact: '新增联系电话',
    addNewAddress: '新增联系地址',
    contactNumber: '电话号码',
    countryCode: '国际电话区号',
    contactNumberType: '电话类别',
    contactNumberType1: '手机',
    contactNumberType2: '家庭',
    contactNumberType3: '工作',
    Mobile: '手机',
    Home: '家庭',
    Work: '工作',
    source: '来源',
    areaCode: '区号',
    ext: '分机号',
    cancel: '取消',
    add: '新增',
    Originator: '原转让机构',
    DCA: '委外机构',
    Debtor: '贷款人',
    DebtorRelatives: '贷款人家属',
    DebtorFriends: '贷款人朋友',
    PublicSource: '公共来源',
  },
  profile: {
    title: 'Profile'
  },
  settings: {
    title: 'Settings'
  }
};
