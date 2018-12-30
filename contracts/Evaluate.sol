pragma solidity ^0.4.4;
pragma experimental ABIEncoderV2;

contract Evaluate {
    //定义老师的结构体
    struct Teacher {
        string name;        //老师的名字
        address addresses;  //老师的地址
    }
    
    //定义学生的结构体
    struct Student {
        string  name;       //学生的用户名
        string  idea;       //学生的想法
        uint    score;      //学生的评分
        string  comment;    //得到的评语
    }

    Teacher public teacher;
    /*mapping (address => Student) public students;
    mapping (string => address) private nameToAddress;
    //记录所有学生名字
    string[] public studentsName;*/
    Student[12] public students;
    bool[12] public graded;

    //是否登陆
    bool public isLogin = false;
    //当前登陆的账户
    address public currLogin;
    
    //合约的拥有者为老师
    constructor () public {
        teacher.addresses = msg.sender;
    }
    

    /*
        账户登陆时确认是学生还是老师
    */
    function login (bool isStudent, string idea, string name) public {
        //合约拥有者不能作为学生登陆
        if (isStudent == true) require(msg.sender != teacher.addresses, "\nnError!You are a teacher!");
        //其他人不能作为老师登陆
        else  require(msg.sender == teacher.addresses, "\nError!You are a student!");
        
        
        /*//学生第一次登陆时必须输入idea
        if (isStudent == true) require(bytes(idea).length != 0 || bytes(students[msg.sender].idea).length != 0, "\nError!Idea is necessary.");
        //学生第一次登陆时必须输入name
        if (isStudent == true) require(bytes(name).length != 0 || bytes(students[msg.sender].name).length != 0, "\nError!Name is necessary.");
        //学生第一次登陆
        if (isStudent == true && bytes(idea).length != 0 && bytes(students[msg.sender].idea).length == 0) {
            //判断该用户名是否被占用
            require(!validStudent(name), "\nError!The name has been used.");
            students[msg.sender].name = name;
            students[msg.sender].idea = idea;
            studentsName.push(name);
            nameToAddress[name] = msg.sender;
        }*/
        isLogin = true;
        currLogin = msg.sender;
    }

    function getGraded() public view returns (bool[12]) {
        return graded;
    }

    function getComment(uint studentID) public view returns (string) {
        return students[studentID].comment;
    }

    function getScore(uint studentID) public view returns (uint) {
        return students[studentID].score;
    }

    /*
        查询学生的想法
    */
    function getIdeaOfStudent(string name) view public returns (string) {
        //是否登陆
        require(isLogin && currLogin == msg.sender, "\nError!Please login first.");
        //判断是否有该学生
        require(validStudent(name), "\nError!Student doesn't exist.");
        //return students[nameToAddress[name]].idea;
    }

    /*
        查询学生的评分
    */
    function getScoreOfStudent(string name) view public returns (uint){
        //是否登陆
        require(isLogin && currLogin == msg.sender, "\nError!Please login first.");
        //判断是否有该学生
        require(validStudent(name), "\nError!Student doesn't exist.");
        //return students[nameToAddress[name]].score;
    }

    /*
        查询学生的评语
    */
    function getCommentOfStudent(string name) view public returns (string){
        //是否登陆
        require(isLogin && currLogin == msg.sender, "\nError!Please login first.");
        //判断是否有该学生
        require(validStudent(name), "\nError!Student doesn't exist.");
       // return students[nameToAddress[name]].comment;
    }
    
    /*
        学生更新自己的idea
    */
    function updateIdea(string idea) public {
        //是否登陆
        require(isLogin && currLogin == msg.sender, "\nError!Please login first.");
        //判断是否是学生
        require(msg.sender != teacher.addresses, "\nError!You are a teacher!");
        //students[msg.sender].idea = idea;
    }
    
    /*
        判断学生是否存在
    */
    function validStudent(string name) view public returns (bool) {
        /*for (uint i = 0; i < studentsName.length; ++i) {
            if (keccak256(name) == keccak256(studentsName[i])) return true;
        }*/
        return false;
    }
    
    function validStudent(uint id) view public returns (bool) {
        if (id < 0 || id > 11) return false;
        else return true;
    }

    /*
        老师评估学生的idea
    */
    function evaluate(uint studentID, uint score, string comment) public {
        //是否登陆
        //require(isLogin && currLogin == msg.sender, "\nError!Please login first");
        //判断是否是老师
        require(msg.sender == teacher.addresses, "\nError!You are a student!");
        //判断学生是否存在
        require(validStudent(studentID), "\nError!Student doesn't exist.");
        
        //分数不能超过100
        require(score <= 100 && score >= 0, "\nError!The range of score is [0, 100].");
        students[studentID].score = score;
        students[studentID].comment = comment;
        graded[studentID] = true;
    }
    
    /*
        得到分数最多的学生名字
    */
    function getHighestStudentName() view public returns (string[] name) {
        /*string[] memory tmp = new string[] (studentsName.length);
        uint score = 0;
        uint maxcount = 0;
        for (uint i = 0; i < studentsName.length; ++i) {
            if (students[nameToAddress[studentsName[i]]].score > score) {
                score = students[nameToAddress[studentsName[i]]].score;
                tmp[0] = studentsName[i];
                maxcount = 1;
            }
            else if (students[nameToAddress[studentsName[i]]].score == score) {
                tmp[maxcount] = studentsName[i];
                maxcount++;
            }
        }
        name = new string[] (maxcount);
        for (uint j = 0; j < maxcount; ++j) {
            name[j] = tmp[j];
        }
        return name;*/
    }
}
