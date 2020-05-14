$(function(){
	//변수선언
	var gp = parseInt($('#cur_star option:selected').val()); //선택된 랭크 
	var cur_exp = parseInt( $('#cur_exp').val() ); //현재 경험치
	var cur_bonus = parseInt( $('.bonus_pnt').text() ); //현재 대성공확률 보너스
	var org_exp = 0; //입력된 경험치 값 

	//셀렉트 박스 이벤트 
	$('select:not(#ancient_key)').on('change', function(){
		cur_enchant = parseInt($('#cur_enchant option:selected').val()); //선택된 훈련단계
		pur_enchant = parseInt($('#pur_enchant option:selected').val()); //선택된 목표 훈련단계
		gp = parseInt($('#cur_star option:selected').val()); //선택된 랭크

		var i = $('.wrap_result').children().length; //빵 선택 갯수


		$('.max_exp').text( pur_enchant - cur_enchant); //최대 경험치 값 갱신

		$('.cast_gold').text(gp * (i)); //예상 금액에 현재 랭크에 따른 금액 계산 

		cal_breadpnt(org_exp);
	});

	//고대던전 키 이벤트
	$('#ancient_key').on('change', function(){
		ancient_regen();
	})

	//인풋박스 이벤트 
	$('#cur_exp').on('change', function(){
		//직접 값 입력시 선택한 빵 제거(빵이 없을때는 경험치만 갱신)
		if( $('.wrap_result').children().length == 0){
			console.log('no bread');
			org_exp = parseInt( $('#cur_exp').val() ); //입력된 경험치 
			cal_breadpnt(org_exp);
			return false;
		}
			console.log('has bread');

			$('.wrap_result').children().remove();
			org_exp = parseInt( $('#cur_exp').val() ); //입력된 경험치 

			cal_breadpnt(org_exp);

			cal_bonus_pnt(0); //대성공확률 갱신 
			cast_gold(0); //예상금액 갱신 


	})

	//빵 아이템 선택
	$('.wrap_sel_bread li button').on('click', function(){

		chk_val = $('#chk_bread_count').is(':checked'); //빵갯수제한 체크박스
		//체크되있으면 단순 빵 추가 
		if(chk_val == true){
			bread_item($(this));
			return false;
		}

		var i = $('.wrap_result').children().length; //빵 선택 갯수
		//빵 최대 6개 선택까지 체크
		if(i >= 6){
			alert('빵을 6개 모두 선택했다.');
			return false;
		};
		bread_item($(this));


	});

	//빵 아이템 제거 
	$('body').on('click', '.result_bread', function(){
		$(this).remove(); //결과보기 화면에서 제거;
		bread_remove($(this));
	});

	//빵 선택 메뉴펼치기 
	$('button.fold').on('click', function(){
		$(this).next().toggle();
	});
		
	//빵 선택 기능
	function bread_item(b){
		bonus_pnt = parseInt( b.find('.bonus').text()); // 선택한 빵의 보너스 상수 
		sel_bread_pnt = parseInt(b.find('.bread_value').text()); // 선택한 빵의 포인트 상수
		bread_name = b.html(); //선택한 빵의 이름 
		cur_bonus = bonus_pnt + cur_bonus; //대성공확률 포인트 합
		cur_exp = cur_exp + sel_bread_pnt; //경험치에 현재 빵추가만큼 합산
		var i = $('.wrap_result').children().length + 1; //빵 선택 갯수
		//console.log(cur_exp +'/'+ sel_bread_pnt);
		//console.log(bonus_pnt +'/'+ cur_bonus);

		$('#cur_exp').val(cur_exp); //현재 경험치 갱신
		
		cal_breadpnt(org_exp); //미리보기 갱신
		cal_bonus_pnt(cur_bonus); //대성공확률 갱신 

		cast_gold(i); //예상금액 갱신 
		scr_result(bread_name); //결과화면 출력 

	}

	//빵 제거 기능 
	function bread_remove(b){
		bonus_pnt = parseInt( b.find('.bonus').text()); // 선택한 빵의 보너스 상수 
		sel_bread_pnt = parseInt(b.find('.bread_value').text()); // 선택한 빵의 포인트 상수
		cur_bonus = cur_bonus - bonus_pnt; //대성공확률 포인트 제거
		cur_exp = cur_exp - sel_bread_pnt; //경험치에 현재 빵 만큼 제거
		i = $('.wrap_result').children().length; //빵 선택 갯수


		$('#cur_exp').val(cur_exp); //현재 경험치 갱신

		
		cal_breadpnt(org_exp); //미리보기 갱신
		cal_bonus_pnt(cur_bonus); //대성공확률 갱신 
		cast_gold(i); //예상금액 갱신 
	}

	//미리보기 화면 표시식
	function cal_breadpnt(org_exp){
		cur_exp = parseInt( $('#cur_exp').val());
		max_exp = parseInt( $('.max_exp').text() );

		//console.log( cur_exp +'/'+ max_exp );

		cal_pnt = cur_exp / max_exp * 100; //퍼센트 구하는 공식
		bon_pnt = (cur_exp - org_exp) / max_exp * 100 / 2 ;//보너스 퍼센트 구하는 공식 

		$('.cur_pnt').css('width', cal_pnt +'%'); //현재 퍼센트 그래프 표시
		$('.bon_pnt').css({
			'width' : bon_pnt +'%',
			'left' : cal_pnt +'%'
			}); //보너스 퍼센트 그래프 표시
		
		$('.cast_exp').text(cur_exp + (cur_exp - org_exp)/2 ); //예상 경험치 갱신

	}

	//대성공 확률 계산기 
	function cal_bonus_pnt(b_pnt){
		if(b_pnt < 100){
			$('.bonus_pnt').text(b_pnt); //대성공확률에 보너스 포인트 표시
			$('.bonus_pnt').removeClass('done');
			return false;
		}
		$('.bonus_pnt').text('100').addClass('done');
	}

	//예상비용 계산
	function cast_gold(i){
		$('.cast_gold').text(gp * (i));
	}

	// 결과보기 출력 
	function scr_result(bread){
		$('.wrap_result').append( '<button type="button" class="result_bread">' + bread + '</button>' );
	}

	//자동계산 기능
	function auto_result(){
		cur_exp = parseInt( $('#cur_exp').val() ); //현재 경험치
		max_exp = parseInt( $('.max_exp').text() ); //전체 경험치
		arr_bread = new Array(); //배열 선언
		
		bread_data = $('.wrap_sel_bread li button').find('.bread_value').text(); //훈련량 텍스트만 뺴옴
		arr_bread = bread_data.split(','); //빵을 ','로 구분해서 배열 처리
		arr_bread.pop(); //마지막 배열 제거 ,추가로 인해 추가됨

		rest_exp = max_exp - cur_exp; //필요한 경험치 값
		
		//필요경험치에 따른 최대값으로 배열 추출
		arr_bread = jQuery.grep(arr_bread, function(a){
			return a <= rest_exp;
		});

		result_val = rest_exp / Math.max.apply(null, arr_bread);// 필요 훈련량을 배열중 최대값으로 나눈다 

		console.log(rest_exp +'/'+ Math.max.apply(null, arr_bread));
		console.log(result_val);
	}

	//고대던전 키 회복시간
	function ancient_regen(){
		//현재 시간 구하기
		ancient_key = new Date();
		t_time = ancient_key.getHours();
		t_minutes = ancient_key.getMinutes();

		need_key = parseInt($('#ancient_key option:selected').val()); //선택된 키 숫자

		pre_time = Math.floor( (need_key * 20 +  t_minutes) / 60); //분 시간
		rest_minutes = (need_key * 20 + t_minutes) % 60; //잔여 분

		//분 mm표시설정 
		if(rest_minutes < 10){
			rest_minutes = '0' + rest_minutes;
		}

		$('.ancient_key_time').text(t_time+pre_time +':'+ rest_minutes);
		console.log(pre_time +'/' + rest_minutes);
	}

	//자동계산 버튼
	$('#btn_auto').on('click', function(){
		//auto_result();
	});

	//초기화
	$('#btn_reset').on('click', function(){
		init();
	});

	function init(){
		$('#cur_star option:first, #cur_enchant option:first, #pur_enchant option:first').prop('selected',  true);
		$('.cur_pnt, .bon_pnt').attr('style','');
		$('input').val('0');
		$('.cast_exp, .cast_gold, .bonus_pnt').text('0');
		$('.max_exp').text(100);
		$('.wrap_result').children().remove();
		$('.bonus_pnt').removeClass('done');
		cur_exp = 0;
		org_exp = 0;
		cur_bonus = 0; 
	}
	//init
	$('.wrap_sel_bread .bonus').append('<span>%</span>'); // %표시 추가
	//배열 구분하기 위해 빵 훈련량에 숨김처리된 ','를 추가
	$('.wrap_sel_bread li button').find('.bread_value').each(function(){
		$(this).append('<span style="display:none">,</span>');
	})

})