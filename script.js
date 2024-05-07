const classes = [
        {name: "인간의 가치탐색", floor: 1},
        {name: "숨겨진 패턴", floor: 5},
        {name: "선형대수", floor: 3},
        {name: "세계와 시민", floor: 6},
        {name: "테스트 중", floor: 1},
        {name: "테스트용 과목", floor: 3}
    ];


document.addEventListener('DOMContentLoaded', function() {
        const input = document.getElementById('class-search');
    const results = document.getElementById('search-results');

    input.addEventListener('input', function() {
        const searchQuery = input.value.toLowerCase();
        results.innerHTML = ''; // Clear previous results
        if (searchQuery.length > 0) {
            const filteredClasses = classes.filter(cls => cls.name.toLowerCase().includes(searchQuery));
            filteredClasses.forEach(cls => {
                const li = document.createElement('li');
                li.textContent = cls.name;
                li.addEventListener('click', () => {
                    input.value = cls.name; // Set input value to selected name
                    results.innerHTML = ''; // Clear results after selection
                });
                results.appendChild(li);
            });
        }
    });
});
 
   document.addEventListener('DOMContentLoaded', function() {
     
        const range = document.querySelector('input[type="range"]');
     const max = parseInt(range.max, 10);

     function updateSliderFill() {
        const percentage = (range.value / max) * 100;
        range.style.setProperty('--thumb-percentage', `${percentage}%`);
     }

    range.addEventListener('input', updateSliderFill);
    updateSliderFill(); // Initial call to set the fill based on the default value
    });

   function updateTimeAndDay() {
    const now = new Date();
    const options = { weekday: 'long' };
    document.getElementById('time').textContent = now.toLocaleTimeString('ko-KR', {
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('day').textContent = now.toLocaleDateString('ko-KR', options);
}
setInterval(updateTimeAndDay, 1000); // Update time every second

 /*팝업 표시*/ 
        const form = document.getElementById('data');
        const modalBackground = document.querySelector('.modal-background');

        // 폼 제출 이벤트 처리
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // 기본 제출 동작 방지
            modalBackground.style.display = 'block'; // 모달 표시
            let message=document.getElementById("popup-text") 
            const floor=getClasseFloor()
            const watings =getWatings()
            const elevatorState ={
                floor: getElevatorFlooorAtNow(),
                isUp: getElevatorIsUp()
            }
            if (IsElevatorMoreFast(floor, watings, elevatorState)){
                message.innerText="엘리베이터로 가세요."
            }
            else{
                message.innerText="계단으로 가세요"
            }
        });

        // 모달 닫기 함수
        function closeModal() {
            modalBackground.style.display = 'none'; // 모달 숨기기
        } 
    



/*
웹앱에서 사용할 계단 vs 엘리베이터 로직
변수: 가야할 층, 현재 탈 엘리베이터에 서있는 사람의 수 
 
그래프를 이용해 계단과 엘리베이터의 이동 경로를 추상화
1. 각 층을 노드, 엘리베이터, 계단의 이동 속도는 가중치
2. 엘리베이터는 5층부터 탄다고 가정하고, 4층까지는 계단을 이용
3. 
*/
elevator_travel_time = [] //5층부터 9층까지 걸리는 시간
var buttomToEndByElevator = [4,8,12,16,24, 40, 56, 72,88] 

function buttomToFloorByStairs(floor) {
      let stair_time = 
      {slow:[28,56,79,99,119,138,156]
      ,fast:[17,28,43,59,74,88,103 ]} 
       return {slow: stair_time.slow[floor-1], fast:stair_time.fast[floor-1]
      } 
 
}
function buttomToFloorByElevator(floor){//1층에서 목표 층까지 가는데 걸리는 시간
     
      return buttomToEndByElevator[floor]
}
function floorToButtomByElevator(ElevatorState){
     if (ElevatorState.isUp==true){
     let floorToTop=buttomToFloorByElevator(9)-buttomToFloorByElevator(ElevatorState.floor)       
     const topTobuttom=buttomToFloorByElevator(9) // 이건 다시 재야함 
      return floorToTop+topTobuttom
     }
     return buttomToFloorByElevator(ElevatorState.floor) //내려가는 시간은 다시 재야함 
}
function getClasseFloor(){ 
    const input = document.getElementById('class-search');
    let floor=0
    for (let i in classes){
        console.log(classes[i].name)
        if (classes[i].name==input.value){
            floor=classes[i].floor
            break 
            } 
        }
   console.log("floor is ", floor) 
console.log(input.value)
        return Number(floor)
}
function getWatings(){
    const value=document.getElementById('slider').value
    console.log(value)
    return value
}
function getElevatorFlooorAtNow(){
   const floor=document.getElementById("elevator-floor").value
   return Number(floor)
}
function getElevatorIsUp(){
   const value = document.querySelector('input[type="radio"]:checked').value
   if (value=="up") {
     console.log("Elevator up")
     return true
   }
   else if (value=="down"){
     console.log("Elevator down ")
     return false
   }
   else{
    alert("현재 엘리베이터가 올라가는지 내려가는지 알려주세요")
   }
}

function IsElevatorMoreFast(floor,watings,ElevatorState){
   stair = buttomToFloorByStairs()
   elevator= floorToButtomByElevator(ElevatorState)+buttomToFloorByElevator(floor)
   if (watings>15){
      watingDelay=buttomToFloorByElevator(9)+floorToButtomByElevator({floor:9, isUp:false})
      elevator+=watingDelay
      }
    
   return elevator>stair
    }