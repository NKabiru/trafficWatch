

// Get elements
var accountUsername = document.getElementById('account-username');
var roadsDiv = document.getElementById('roads'); 
var ctx = document.getElementById('myChart');


// Creating sample chart
var myChart = new Chart(ctx,{
	type: 'bar',
	data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});


// QUERY 1. Time of congestion && rush hour roads to avoid
firebase.database().ref('alerts').orderByChild('timestamp').once('value', snap =>{
	snap.forEach(alertSnap =>{
		if (alertSnap.val().roadState == 'congestion') {
			var date = new Date(alertSnap.val().timestamp);
		// console.log(date);

		switch(date.getHours()){
			case 8:
			case 9:
			case 10:
				var ul = document.createElement('ul');
				var el = document.createElement('li');
				ul.innerText = 'Morning';
				el.innerText = alertSnap.val().roadName;
				ul.appendChild(el);
				roadsDiv.appendChild(ul);
				return;
			case 16:
			case 17:
			case 18:
				var ul = document.createElement('ul');
				var el = document.createElement('li');
				ul.innerText = 'Evening';
				el.innerText = alertSnap.val().roadName;
				ul.appendChild(el);
				roadsDiv.appendChild(ul);
				return;
			default:
				// var ul = document.createElement('ul')
				// var el = document.createElement('li');
				// ul.innerText = "None at the moment";
				// ul.appendChild(el);
				// roadsDiv.appendChild(ul);
				return;
	}
		}
	});
});




// 4. Users that are admins 
// firebase.database().ref('users').orderByChild('isAdmin').equalTo(true).on('value', snap => {
// 	divAdmins.innerText = "Administrators:\n";	
// 	snap.forEach(admin =>{
// 		var el = document.createElement('li');
// 		el.innerText = admin.val().username;
// 		divAdmins.appendChild(el);
// 	});
// });


