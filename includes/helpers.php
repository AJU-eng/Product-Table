<?php
/*
 * Get product quantity in cart
 * @param product_id
*/
if( !function_exists('awcpt_get_cart_item_quantity') ) {
	function awcpt_get_cart_item_quantity( $product_id ){
		global $woocommerce;
		$in_cart = 0;

		if( is_object( $woocommerce->cart ) ){
			$cart_contents = $woocommerce->cart->cart_contents;
			if( $cart_contents ){
			foreach( $cart_contents as $key=> $cart_content ){
				if( $cart_content['product_id'] == $product_id ){
					$in_cart += $cart_content['quantity'];
				}
			}
			}
		}

		return $in_cart;
	}
}
