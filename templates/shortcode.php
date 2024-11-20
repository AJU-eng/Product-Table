<?php
$product_id = intval( $prd_data['id'] );
$shortcode = $column['sCode'];

if( ! empty( $shortcode ) ) {
	// Sanitize the shortcode by replacing placeholders
	if( strpos( $shortcode, '{productID}' ) !== false ) {
		$shortcode = str_replace( '{productID}', esc_attr( $product_id ), $shortcode );
	}

	if( strpos( $shortcode, '{variationID}' ) !== false ) {
		$shortcode = str_replace( '{variationID}', esc_attr( $product_id ), $shortcode );
	}

	// Wrap the shortcode output
	$shortcode_output = '<div class="awcpt-shortcode-wrap">';
	$shortcode_output .= do_shortcode( wp_kses_post( $shortcode ) );
	$shortcode_output .= '</div>';

	echo $shortcode_output;
} else {
	return;
}
