export default {
  app: {
    footer: {
      madeByHtml: ''
    },
    links: {
      firebase: 'Firebase',
      home: 'Home',
      login: 'Login',
      me: 'Me',
      todos: 'Todos',
      debtors: '贷款人'
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
    infoHtml: '<a href="https://github.com/este/este">Este.js</a> dev stack.',
    iosInfoText: `
      Este.js dev stack
      Press CMD+R to reload
      Press CMD+D for debug menu
    `,
    title: 'Este.js',
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
    headerTitle: '贷款人搜索',
    idCard: '身分证号',
    name: '姓名',
    originatedAgreementNo: '原贷款合同号'
  },
  profile: {
    title: 'Profile'
  },
  settings: {
    title: 'Settings'
  }
};
