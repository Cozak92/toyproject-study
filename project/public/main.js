/**
 * 스터디모집글 조회
 */
axios.get('/recruit')
    .then((res) => {
        let study = [];
        let preSgId = 0;

        res.data.forEach((item, index, arr) => {
            // 처음값이거나 전의 sg_id 와 현재 sg_id 값이 다를때
            if ((index === 0) || (preSgId !== item.SG_ID)) {
                item.CC_DESC = [item.CC_DESC];
                study.push(item);
            } else {    // 이미 있는 json 객체에 ST_CODE 배열에 값 추가
                study[study.length - 1].CC_DESC.push(item.CC_DESC);
            }
            preSgId = item.SG_ID;
        });

        console.log(study);

        // 요소 만들기
        let innerHtml = ``;

        study.forEach((item, index, arr) => {

            if ((index === 0) || (index === 4)) {
                innerHtml += `
                    <div class="contact-info-area mg-t-30">
                        <div class="container">
                            <div class="row">
                `;
            }

            innerHtml += `
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="contact-inner">
                        <div class="contact-hd widget-ctn-hd">
                            <h2>${item.SR_TITLE}</h2>
                            <p>#${item.CC_DESC.join(' #')}</p>
                        </div>
                    </div>
                </div>
            `;

            innerHtml += `
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="contact-inner">
                        <div class="contact-hd widget-ctn-hd">
                            <h2>${item.SR_TITLE}</h2>
                            <p>#${item.CC_DESC.join(' #')}</p>
                        </div>
                    </div>
                </div>
            `;

            if ((index === (study.length - 1)) || (index === 3)) {
                innerHtml += `
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        console.log(innerHtml);
        document.getElementById('studyRecruit').innerHTML = innerHtml;

    })
    .catch((err) => {
        console.error(err);
    });
    