App = {
  web3Provider: null,
  contracts: {},
  comments: [],
  scores: [],

  init: async function() {
    // 从json中获取初始信息
    $.getJSON('../students.json', function(data) {
      var studentsRow = $('#studentsRow');
      var studentTemplate = $('#studentTemplate');

      for (i = 0; i < data.length; i ++) {
        studentTemplate.find('.panel-title').text(data[i].name);
        studentTemplate.find('img').attr('src', data[i].picture);
        studentTemplate.find('.student-id').text(data[i].studentId);
        studentTemplate.find('.student-age').text(data[i].age);
        studentTemplate.find('.student-idea').text(data[i].idea);
        studentTemplate.find('.btn-grade').attr('data-id', data[i].id);
        studentTemplate.find('.input-score').attr('name', "name-score-" + i);
        studentTemplate.find('.input-comment').attr('name', "name-comment-" + i);

        studentsRow.append(studentTemplate.html());
      }
    });

    $.getJSON('../info.json', (data) => {
      for (i = 0; i < data.length; ++i) {
        this.comments[data[i].id] = data[i].comment;
        this.scores[data[i].id] = data[i].score;
      }
    });

    return await App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
  
    return App.initContract();
  },

  initContract: function() {
    // 加载Evaluate.json，保存了Evaluate的ABI（接口说明）信息及部署后的网络(地址)信息，它在编译合约的时候生成ABI，在部署的时候追加网络信息
    $.getJSON('Evaluate.json', function(data) {
      // 用Evaluate.json数据创建一个可交互的TruffleContract合约实例。
      var EvaluateArtifact = data;
      App.contracts.Evaluate = TruffleContract(EvaluateArtifact);
  
      // Set the provider for our contract
      App.contracts.Evaluate.setProvider(App.web3Provider);
  
      // Use our contract to retrieve and mark the graded students
      return App.markEvaluated();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-grade', App.handleEvaluate);
  },

  markEvaluated: function() {
    var evaluateInstance;

    App.contracts.Evaluate.deployed().then(function(instance) {
      evaluateInstance = instance;
  
      // 调用合约的getGraded(), 用call读取信息不用消耗gas
      return evaluateInstance.getGraded.call();
    }).then((graded) => {
      for (i = 0; i < graded.length; i++) {
        if (graded[i] != false) {
          console.log(this.comments);
          $('.panel-student').eq(i).find('.input-comment').val(this.comments[i]).attr('disabled', true).
          attr('style', 'color:red');
          $('.panel-student').eq(i).find('.input-score').val(this.scores[i]).attr('disabled', true).
          attr('style', 'color:red');
          $('.panel-student').eq(i).find('button').text('graded').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleEvaluate: (event) => {
    event.preventDefault();
  
    var studentID = parseInt($(event.target).data('id'));
    var name_score = "input[name='name-score-" + studentID + "']";
    var name_comment = "input[name='name-comment-" + studentID + "']";
    var score = Number($(name_score).val());
    var comment = $(name_comment).val();
    this.App.comments[studentID] = comment;
    this.App.scores[studentID] = score;
    console.log("score:" + typeof(score) + " " + score);
    console.log("comment:" + typeof(comment) + " " + comment);
    if (score >= 0 && score <= 100) {
      $.post("http://127.0.0.1:1337/", {"id": studentID, "score": score, "comment": comment}, function(data,status){
        console.log("数据：" + data + "\n状态：" + status);
      });
    }
    var evaluateInstance;
  
    // 获取用户账号
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[1];
    
      App.contracts.Evaluate.deployed().then(function(instance) {
        evaluateInstance = instance;
    
        // 发送交易评价学生idea
        return evaluateInstance.evaluate(studentID, score, comment, {from: account});
      }).then(function(result) {
        return App.markEvaluated();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
