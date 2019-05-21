(function(){
  "use strict";
  var email = ['A','D','I','L','A','P','A','P','A','Y','A','@','G','M','A','I','L'];
  var w = 260,
      h = 30,
      x = d3.scale.ordinal().domain(d3.range(email.length)).rangePoints([0, w - 20]),
      t = Date.now(),
      ln = email.length;
  var data = [];
  var i=-1; while(++i<ln){
  	data.push({name:email[i],id:i})
  }

  var footer = d3.select('body').select('footer')
      ,yyyy = new Date().getFullYear()
      , adilaHTML = '<h6><span id="copy">\&copy; '+yyyy+': <a href="http://adilapapaya.com" target="_"blank">Adila Faruk</a></span><h6>'
      , emailHTML = '<h6></span><small id = "email" class="text-center"></small><h6>'
      , friendsHTML = '<h6><span id="friends"></span><h6>'
      , footerHTML = adilaHTML + emailHTML + friendsHTML;
  var footerNode = footer.node();
  if(!footerNode){
    footer = d3.select('body').append('footer')
      .html(footerHTML);
  }
  else{
    if(!footer.select('#copy').node())
      footer.html(footerNode.innerHTML + adilaHTML);
       
    if(!footer.select('#email').node()){
       footer.html(footerNode.innerHTML + emailHTML);
       
    }
    if(!footer.select('#friends').node()){
      footer.html(footerNode.innerHTML + friendsHTML);
    }
  }

  var svg =  d3.select('#email').append("svg:svg")
      .attr("width", w)
      .attr("height", h);
         

  var blocks = svg.append("g")
      .attr("class", "blocks")
        .selectAll(".block")
        .data(data);
  blocks.enter().append("g")
          .attr("class", "block")
          .attr("transform", function(d,i) { 
            return "translate("+(x(i))+","+(-100)+")"
           +"rotate("+( Math.random()*((i+1)%2 - .5) * 20)+")";
       })
  blocks.append("rect")
  	.attr("width", 16)
      .attr("height",16)
      .style({
            fill:'#000'
            ,stoke:'#999'
          });
   
  blocks.append("text")
  	.attr("x",8).attr("y",8)
      .attr("dy", ".3em")
      .style({
        "text-anchor":"middle"
        ,"fill":'#fff'
      })
      .text(function(d){ return d.name; });

   blocks.transition()
  	.ease("bounce")
  	.delay(function(d,i){ return 500*i; })
      .duration(5000)
       .attr("transform", function(d,i) { 
            return "translate("+x(i)+","+(h-18)+")"
            +"rotate("+( Math.random()*(i%2 - .5) * 20)+")";
       });

  var friends = d3.select('#friends')
                  .style('color','#fff')
                  .html("Let's be friends, yes?")
                  .transition().delay(10000).duration(3000)
                  .style('color','#1f77b4');
 
})();
    