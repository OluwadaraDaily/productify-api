document.addEventListener("DOMContentLoaded", () => {
	
	// When reloaded, get cart items and the count
	// var storedCart = JSON.parse(localStorage.getItem("cart"))
	
	// addCartCount = () => {
	// 	if(!storedCart){
	// 		document.getElementById("cart-count").innerHTML = 0;
	// 	} else {
	// 		document.getElementById("cart-count").innerHTML = storedCart.length;	
	// 	}
			
	// }
	
	// addCartCount()	
	
	// When I click on the button, the item should be added to the cart
	// The cart is stored in localStorage
	// If the cart is empty, create a new cart
	var allBtns = document.getElementsByClassName("add-to-cart-btn");

	for(i = 0; i < allBtns.length; i++) {
		allBtns[i].addEventListener("click", function () {
			
			var name = this.dataset.name;
			var price = this.dataset.price
			var csrfToken = this.dataset.csrf

			addToCart(name, price, csrfToken)
			
			// if(storedCart){
			// 	storedCart.push(name)
			// 	localStorage.setItem("cart", JSON.stringify(storedCart))
				
			// 	// console.log(storedCart)
			// 	// addCartCount()
			// }
			// else {
			// 	cart = []
			// 	cart.push(name)
			// 	localStorage.setItem("cart", JSON.stringify(cart))
			// 	console.log(localStorage.getItem("cart"))
			// 	document.getElementById("cart-count").innerHTML = cart.length;
			// }	
		})
	}
	
	function addToCart(name, price, csrfToken) {
		fetch('cart', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				"Accept": "application/json"
			},

			body: JSON.stringify({ 'name': name, 'price': price })
		})
		.then((response) => {
			return response.text()
		})
		.then((data) => {
			// console..log(data)
			alert(data)
		})
	}
})
