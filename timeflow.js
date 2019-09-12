
const timeflow = new Plugin({
  name: "TimeFlow"
})
const dm1 = new dropMenu({
  id:"timeflow_dropmenu"
});
timeflow.createData({
    "times":["0","0","0","0","0","0","0"],
    "today":new Date(),
    "status":"desactivated"
});
let days;
let count = 0;

timeflow.getData(function(data){
  let times = data["times"]
  times.splice(0,1); //Remove one day to the left
  timeflow.setData("times",times); //Save the data
  function renderGraphic(){
    timeflow.getData(function(data){
      const new_times = data["times"];
      days = `
      <div id="timeflow_content">
      <p style="text-align:center;"> TimeFlow <p>
      <div id="D1" class="day">
      <div class="activity" value="${new_times[0]}" style=" height:${(new_times[0]/200000)}px"></div></div>
      <div id="D2" class="day">
      <div class="activity" value="${new_times[1]}" style=" height:${(new_times[1]/200000)}px"></div></div>
      <div id="D3" class="day">
      <div class="activity" value="${new_times[2]}" style=" height:${(new_times[2]/200000)}px"></div></div>
      <div id="D4" class="day">
      <div class="activity" value="${new_times[3]}" style=" height:${(new_times[3]/200000)}px"></div></div>
      <div id="D5" class="day">
      <div class="activity" value="${new_times[4]}" style=" height:${(new_times[4]/200000)}px"></div></div>
      <div id="D6" class="day">
      <div class="activity" value="${new_times[5]}" style=" height:${(new_times[5]/200000)}px"></div></div>
      <div id="D7" class="day">
      <div class="activity" value="${new_times[6]}" style=" height:${(new_times[6]/200000)}px"></div></div>
      </div>
      <span class="line_space_menus"></span>
      <gv-switch id=time_flow_switcher   class="`+data["status"]+`"></gv-switch>
      `;
      const myDropmenu ={
        "button": "Time Flow",
        "custom":days,
        "list":{
          "*line":"",
          "Information":{
            click:()=>{
              new Dialog({
                id:"timeflow_info",
                title:getTranslation("About")+" Timeflow" ,
                content:"TimeFlow collets the time you spent on coding by saving <strong>locally</strong> the data.",
                buttons:{
                  [getTranslation("Close")]:{},
                }
              })
            }
          }
        }
      }
      dm1.setList(myDropmenu)
      const activities = document.getElementsByClassName("activity");
      for(i=0;i<activities.length;i++){
        activities[i].addEventListener("click",function(){
          const floatingwin = new floatingWindow([100,50],`
          <div style='height:100px; width:100px;'>
            <p style="color:var(--white-black)">
              ${((this.getAttribute("value")/1000)/ 3600).toFixed(2)+" hours"}
            </p>
          </div>`) 
        }, false);
      }
      document.getElementById('time_flow_switcher').onclick = function(){
        if(timeflow.getData()["status"]=="desactivated"){
          timeflow.setData("status","activated");
          loop();
        }else {
          timeflow.setData("status","desactivated");
        }
      }
    })
  }
  renderGraphic();
  async function loop(){
    const delay = setTimeout(() => {
      count += 150000;
      let new_data = timeflow.getData()["times"];
      new_data[6] = count;
      timeflow.setData("times",new_data);
      renderGraphic(); //Updates the dropmenu
      if(timeflow.getData()["status"] =="activated"){
        loop();
      }    
    },150000) //150000
  }
  loop()
})