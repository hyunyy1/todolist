const express = require('express');
const app = express();

const cors = require('cors');

const cors_opts = {
    'origin': '*',
    'methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'allowedHeaders': 'Origin, Accept, Content-Type, Content-Length, X-Requested-With',
    'exposedHeaders': 'Content-Disposition',
};
app.use(cors(cors_opts));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// MySQL
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pw123',
    database: 'todolist'
});

conn.connect();
console.log('mysql 접속 성공');


app.get('/', (req, res) => {
    res.render("home.ejs");
});


app.get('/write', (req, res) => {
    res.render("write.ejs");
});



/**
 * todoList 정보 등록
 * @route {POST} /add
 * @formData {string} title - 할 일 제목
 * @formData {string} date - 날짜
 */

app.post('/add', (req, res) => {
    
    var title = req.body.title;
    var date = req.body.date;

    /**
     * SQL ID  : ADD_TODOLIST
     * DESC.   : todoList 정보 DB에 등록
     * COMMENT :
     * HISTORY : 2023.03.21 / 쿼리 정의
     */
    let sql = `insert into todo (detail, date) values ("${title}", "${date}")`;    

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err);
        } else {
            // res.redirect('/list')
            res.status(200).send({message: '등록 성공!'});
        }
    });   
});


/**
 * todoList 전체 목록 조회 
 * @route {GET} /list?lang={lang}
 * @param {string} lang - 언어
 */

app.get('/list', (req, res) => {

    /**
     * SQL ID  : GET_TODOLIST
     * DESC.   : todoList 전체 목록 조회
     * COMMENT :
     * HISTORY : 2023.03.21 / 쿼리 정의
     */
    let sql = `select no, detail, date from todo;`;

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err);
        } else {
            // res.render("list.ejs", {posts: rows});
            res.status(200).send(rows);
        }
    });
});


/**
 * todoList 목록 검색
 * @route {GET} /search?value={inputValue}
 * @param {string} inputValue - 검색어 ( 할 일 제목 or 날짜 )
 */

app.get('/search', (req, res) => {

    var inputValue = req.query.value;

    /**
     * SQL ID  : SEARCH_TODOLIST
     * DESC.   : 검색어에 해당하는 todoList 목록 조회
     * COMMENT :
     * HISTORY : 2023.03.21 / 쿼리 정의
     */
    let sql = `select no, detail, date from todo where detail like '%${inputValue}%' or date like '%${inputValue}%'`;

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err);
        } else {
            // res.render("search.ejs", {posts: rows});
            res.status(200).send(rows);
        }
    });
});


/**
 * todoList 삭제 
 * @route {DELETE} /delete
 * @formdata {integer} no - 할 일 번호
 */

app.delete('/delete', (req, res) => {

    no = parseInt(req.body.no);

    /**
     * SQL ID  : DELETE_TODOLIST
     * DESC.   : todoList 삭제
     * COMMENT :
     * HISTORY : 2023.03.21 / 쿼리 정의
     */    
    let sql = `delete from todo where no = ${no}`;

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err);
        } else {
            console.log('db에서 삭제 성공');
            res.status(200).send({message: '삭제 성공!'});
        }
    });
});


/**
 * 수정페이지 상세 조회 
 * @route {GET} /edit/{no}
 * @param {integer} no - 할 일 번호
 */

app.get('/edit/:no', (req, res) => {

    no = parseInt(req.params.no);

    /**
     * SQL ID  : GET_EDITDETAIL
     * DESC.   : 할 일 번호에 해당하는 수정페이지 상세 조회
     * COMMENT :
     * HISTORY : 2023.03.21 / 쿼리 정의
     */
    let sql = `select no, detail, date from todo where no = ${no}`;

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(rows);
            // res.render("edit.ejs", {post : rows});
            res.status(200).send(rows);
        }
    });
});


/**
 * todoList 수정 
 * @route {PUT} /edit
 * @formData {integer} no - 할 일 번호
 * @formData {string} title - 할 일 제목
 * @formData {string} date - 날짜
 */

app.put('/edit', (req, res) => {

    no = parseInt(req.body.id);
    var title = req.body.title;
    var date = req.body.date;

    /**
     * SQL ID  : EDIT_TODOLIST
     * DESC.   : todoList 업데이트 
     * COMMENT :
     * HISTORY : 2023.03.21 / 쿼리 정의
     */  
    let sql = `update todo set detail = '${title}', date = '${date}' where no = ${no}`;

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err);
        } else {
            console.log('수정 완료!');
            res.status(200).send({message: '수정 성공!'});
            // res.redirect('/list');
        }
    });
});



app.listen(80, () => {
    console.log('listening on 80');
});
