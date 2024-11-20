<?php
$use_woo_btn = $column['wooDefault'];
if( $use_woo_btn ){
	echo '<div class="awcpt-woo-btn">';
		woocommerce_template_loop_add_to_cart();
	echo '</div>';
	return;
} else {
	if( ! empty( $column['btnLabel'] ) ){
		$btn_label = $column['btnLabel'];
	} else {
		$btn_label = 'Click here';
	}

	$click_action = $column['clickAction'];
	if( $product->get_type() == 'grouped' || $product->get_type() == 'variable' ) {
		$click_action = 'product_page';
	}

	$target = 'target="_self"';
	switch ( $click_action ) {
		case 'product_page':
			$href = get_permalink( $prd_data['id'] );
			break;

		case 'product_page_newtab':
			$href = get_permalink( $prd_data['id'] );
			$target = 'target="_blank"';
			break;

		case 'cart_refresh':
			$href = '';
			break;

		case 'cart_redirect':
			$href = wc_get_cart_url();
			break;

		case 'cart_checkout':
			$href = wc_get_checkout_url();
			break;

		case 'external_link':
			if( $product->get_type() == 'external' ) {
				$href = $product->get_product_url();
				$target = 'target="_blank"';
			} else {
				return;
			}
			break;

		default:
			$href = wc_get_cart_url();
			break;
	}

	// disabled class
	if( ! in_array( $click_action, array( 'product_page', 'product_page_newtab', 'external_link' ) ) && in_array( $product->get_type(), array( 'simple', 'variable' ) ) && ( ! $product->is_purchasable() || ! $product->is_in_stock() ) ) {
		$disabled_class = 'awcpt-btn-disabled';
	} else {
		$disabled_class = '';
	}

	// cartbadge and btn loader condition
	if( ! in_array( $click_action, array( 'product_page', 'product_page_newtab', 'external_link' ) ) ){
		$in_cart = awcpt_get_cart_item_quantity( $prd_data['id'] );
		$cart_badge_class = 'awcpt-cart-badge';
		if( $in_cart < 1 ){
			$in_cart = '';
			$cart_badge_class .= ' awcpt-cart-badge-hide';
		}
		$cart_badge = '<i class="'.esc_attr($cart_badge_class).'">'.esc_attr($in_cart).'</i>';
		$btn_loader = '<span class="awcpt-btn-loader"></span>';
	} else {
		$cart_badge = '';
		$btn_loader = '';
	}

    // Button styles
	$btn_styles = '';
	if( $column['btnBgColor'] ) {
		$btn_styles .= 'background-color: '.esc_attr($column['btnBgColor']).'; ';
	}

	if( $column['btnColor'] ) {
		$btn_styles .= 'color: '.esc_attr($column['btnColor']).'; ';
	}

	if( $column['btnBorderWidth'] ) {
		$btn_styles .= 'border-width: '.esc_attr($column['btnBorderWidth']).'px; ';
	}

	if( $column['btnBorderStyle'] ) {
		$btn_styles .= 'border-style: '.esc_attr($column['btnBorderStyle']).'; ';
	}

	if( $column['btnBorderColor'] ) {
		$btn_styles .= 'border-color: '.esc_attr($column['btnBorderColor']).'; ';
	}

	if( $column['btnBorderRadius'] ) {
		$btn_styles .= 'border-radius: '.esc_attr($column['btnBorderRadius']).'px; ';
	}

	if( $column['btnPadding'] ) {
		$btn_styles .= 'padding: '.esc_attr($column['btnPadding']).'; ';
	}

	if( $column['btnTextAlign'] ) {
		$btn_styles .= 'text-align: '.esc_attr($column['btnTextAlign']).';';
	}

	// btn hover styles
	$btn_hover_styles = '';
	if( $column['btnHoverBgColor'] && $column['btnBgColor'] ) {
		$btn_hover_styles .= "this.style.backgroundColor='".esc_attr($column['btnHoverBgColor'])."';";
	}

	if( $column['btnHoverColor'] && $column['btnColor'] ) {
		$btn_hover_styles .= "this.style.color='".esc_attr($column['btnHoverColor'])."';";
	}

	if( $column['btnHoverBorderColor'] && $column['btnBorderColor'] ) {
		$btn_hover_styles .= "this.style.borderColor='".esc_attr($column['btnHoverBorderColor'])."';";
	}

	// btn mouse out styles
	$btn_mout_styles = '';
	if( $column['btnBgColor'] ) {
		$btn_mout_styles .= "this.style.backgroundColor='".esc_attr($column['btnBgColor'])."';";
	}

	if( $column['btnColor'] ) {
		$btn_mout_styles .= "this.style.color='".esc_attr($column['btnColor'])."';";
	}

	if( $column['btnBorderColor'] ) {
		$btn_mout_styles .= "this.style.borderColor='".esc_attr($column['btnBorderColor'])."';";
	}

	// btn html main
	$button_html = '<a class="awcpt-button awcpt-action-btn awcpt-action-'. esc_attr($click_action) . ' '.esc_attr($disabled_class).'" id="awcpt-action-btn-'.esc_attr($prd_data['id']).'" href="'.esc_url($href)  .'" '.esc_attr($target)  . ' data-action="'.esc_attr($click_action).'" style="'.esc_attr($btn_styles).'" onmouseover="'.esc_attr($btn_hover_styles).'" onmouseout="'.esc_attr($btn_mout_styles).'">';
	$button_html .= esc_html__( $btn_label, 'product-table-for-woocommerce' );
	$button_html .= wp_kses_post($cart_badge);
	$button_html .= wp_kses_post($btn_loader);
	$button_html .= '</a>';

	echo $button_html;
}