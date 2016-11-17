<!doctype html>
<head>
	<title>Send Yourself Files</title>
	<style type="text/css">
		body, html{
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			margin: 0;
			padding: 0;
		}
		#content{
			max-width: 100%;
			width: 640px;
			padding: 1em;
			box-sizing: border-box;
			margin: 0 auto;
		}
		input{
			font-size: 1.5em;
			padding: .5em;
			border: 1px solid black;
			border-radius: 2px;
		}
	</style>
</head>
<body>
	<div id="content">
		<h1>Send yourself:</h1>
		<ul>
		<% routes.forEach(function(route){ %>
			<li><a href="<%- route[0] %>"><%- route[1] %></a></li>
		<% }); %>
		</ul>
	</div>
</body>
</html>