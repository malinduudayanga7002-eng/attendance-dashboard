let DATA,trendChart,deptChart;
const $=id=>document.getElementById(id);
function total(items,cat){return items.filter(x=>x.category===cat).reduce((a,x)=>a+Object.values(x.daily).reduce((s,v)=>s+(+v||0),0),0)}
async function init(){DATA=await fetch('data.json').then(r=>r.json());
[...new Set(DATA.departments.map(x=>x.section))].forEach(s=>{let o=document.createElement('option');o.value=s;o.textContent=s;$('deptFilter').appendChild(o)});
$('deptFilter').onchange=render;render()}
function render(){let f=$('deptFilter').value,items=f==='ALL'?DATA.departments:DATA.departments.filter(x=>x.section===f);
$('approved').textContent=f==='ALL'?DATA.totalApproved:(items.find(x=>x.approved!=null)?.approved??'—');
$('present').textContent=total(items,'Present').toLocaleString();$('leave').textContent=total(items,'Leave').toLocaleString();$('unauth').textContent=total(items,'Unauthorized').toLocaleString();
let labels=DATA.days.map(String), byDay=cat=>DATA.days.map(d=>items.filter(x=>x.category===cat).reduce((s,x)=>s+(+x.daily[d]||0),0));
if(trendChart)trendChart.destroy();trendChart=new Chart($('trend'),{type:'line',data:{labels,datasets:[
{label:'Present',data:byDay('Present'),tension:.25},{label:'Leave',data:byDay('Leave'),tension:.25},{label:'Unauthorized',data:byDay('Unauthorized'),tension:.25}]},options:{responsive:true,maintainAspectRatio:false}});
let secs=[...new Set(items.map(x=>x.section))];
if(deptChart)deptChart.destroy();deptChart=new Chart($('dept'),{type:'bar',data:{labels:secs,datasets:[{label:'Present',data:secs.map(s=>total(items.filter(x=>x.section===s),'Present'))}]},options:{responsive:true,plugins:{legend:{display:false}}}});
let body=$('detailTable').querySelector('tbody');body.innerHTML='';secs.forEach(s=>{let q=items.filter(x=>x.section===s);body.insertAdjacentHTML('beforeend',`<tr><td>${s}</td><td>${total(q,'Present').toLocaleString()}</td><td>${total(q,'Leave').toLocaleString()}</td><td>${total(q,'Unauthorized').toLocaleString()}</td></tr>`)})}
init();