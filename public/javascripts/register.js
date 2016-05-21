
var roleSelection = $("#role")
roleSelection.on('change', function(){
	
	if(roleSelection[0].value == 'orchestra_officer'){
		console.log("orc");
		$("#orcName").show();
	} else {
		console.log("music");
		$("#orcName").hide();
	}
})

