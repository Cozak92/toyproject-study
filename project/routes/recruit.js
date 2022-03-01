// 스터디 모집 관련 라우터
const express = require('express');
const db = require('../lib/db');
const recruitQuery = require('../queries/recruit');
const router = express.Router();

/** 
 * 스터디모집글 목록 조회
 */
router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(recruitQuery.getRecruit);
        res.json(result[0]);    // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
    } catch (err) {
        console.error(err);
        next(err);
    }
});

/**
 * 스터디모집글 상세 조회
 */
router.get('/detail/:sgId', async (req, res, next) => {
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const sgId = req.params.sgId;

    try {
        // 조회수 증가
        await db.query(recruitQuery.modifyStudyRcrmViews, [sgId]);
        
        // 상세조회
        const result = await db.query(recruitQuery.getRecruitDetail, [userId, sgId]);
        res.json(result[0]);    // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
    } catch (err) {
        console.error(err);
        next(err);
    }

});

/**
 * 스터디모집글 상세 댓글 조회
 */
router.get('/comment/:sgId', async (req, res, next) => {
    const sgId = req.params.sgId;

    try {
        const result = await db.query(recruitQuery.getRecruitComment, [sgId]);
        res.json(result[0]);   // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
    } catch (err) {
        console.error(err);
        next(err);
    } 
});

/**
 * 스터디모집글 상세 댓글 등록
 */
router.post('/comment', async (req, res, next) => {
    const comment = req.body;
    const userId = 1; // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기

    try {
        const result = await db.query(recruitQuery.createRecruitComment, [comment.sgId, comment.srcContent, userId, userId]);
        res.json(result[0]);    // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
    } catch (err) {
        console.error(err);
        next(err);
    } 
});

/**
 * 스터디모집글 상세 댓글 수정
 */
router.put('/comment', async (req, res, next) => {
    const comment = req.body;
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기

    try {
        const result = await db.query(recruitQuery.modifyRecruitComment, [comment.srcContent, userId, comment.srcId]);
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

/**
 * 스터디모집글 상세 댓글 삭제
 */
router.delete('/comment/:srcId', async (req, res, next) => {
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const srcId = req.params.srcId;

    try {
        const result = await db.query(recruitQuery.removeRecruitComment, [userId, srcId]);
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

/**
 * 공통코드 조회
 */
router.get('/comCd/:cgcName', async (req, res, next) => {
    const cgcName = req.params.cgcName;

    try {
        // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
        const result = await db.query(recruitQuery.getRecruitComCd, [cgcName]);
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

/**
 * 스터디 / 스터디 모집글 생성
 */
router.post('/', async (req, res, next) => {
    // [TODO] 트랜잭션 처리
    // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const {srTitle, sgName, sgCnt, sgCategory, stCode, srContent} = req.body;
    let sgId;
    let insertValues = ``;
    let paramArr = [];
    
    try {
        // await db.beginTransaction();
        const result = await db.query(recruitQuery.createStudyGroup, [sgName, sgCategory, sgCnt, userId, userId]);  // 스터디그룹
        sgId = result[0].insertId;
        
        await db.query(recruitQuery.createStudyRcrtm, [sgId, srTitle, srContent, userId, userId]);                  // 스터디모집글
        await db.query(recruitQuery.createStudyMember, [sgId, userId, userId, userId]);                             // 스터디멤버

        // 기술스택(stCode)을 하나 이상 선택했을때 -> 아무것도 선택하지 않으면 insert 안함
        if (stCode.length) {
            stCode.forEach((item, index) => { 
                insertValues += `
                    (?, '${item}', 'N', ?, NOW(), ?, NOW())
                `;
                insertValues += (index === (stCode.length - 1)) ? `` : `, `;
                paramArr = paramArr.concat([sgId, userId, userId]);             // 스터디 기술스택 생성 쿼리 파라미터 (insertValues가 생기는 개수만큼 파라미터 만들기)
            });
    
            await db.query(recruitQuery.createStudyTchsh + insertValues, paramArr);                                     // 스터디 기술스택
        } 
        // await db.commit();
    } catch (err) {
        console.error(err);
        // await db.rollback();
        next(err);
    }

    res.json({res: 'success'});
});

/**
 * 스터디 / 스터디모집글 수정
 */
router.put('/', (req, res, next) => {

});

/**
 * 스터디 폐쇄
 */
router.delete('/', (req, res, next) => {
    // 실제론 del_yn 수정
});

module.exports = router;