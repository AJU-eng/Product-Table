<?php
$meta_key = sanitize_text_field( $column['metaKey'] );
$managed_by = sanitize_text_field( $column['manageBy'] );
$no_value_msg = ! empty( $column['noValMsg'] ) ? sanitize_text_field( $column['noValMsg'] ) : 'Value not found';
$product_id = intval( $prd_data['id'] );

if( empty( $managed_by ) || empty( $meta_key ) ){
	return;
} else {
	$cf_html = '<div class="awcpt-customfield-wrap">';

	if( $managed_by == 'wp' ){
		$display = sanitize_text_field( $column['display'] );
		$field_value = get_post_meta( $product_id, $meta_key, true );
		
		if( $field_value ){
			switch ( $display ) {
				case 'text':
					$cf_html .= '<p class="awcpt-cf-text">'. esc_html( $field_value ) .'</p>';
					break;

				case 'html':
					$cf_html .= '<div class="awcpt-cf-html">'.do_shortcode( wp_kses_post( $field_value ) ).'</div>';
					break;

				case 'link':
				case 'link_new_tab':
					$label = rtrim( preg_replace("(^https?://)", "", $field_value ), '/' );
					$cf_html .= '<a class="awcpt-cf-link" href="'. esc_url( $field_value ) .'"'. ( $display == 'link_new_tab' ? ' target="_blank"' : '' ) .'>'. esc_html( $label ) .'</a>';
					break;

				case 'phoneNo':
					$cf_html .= '<a class="awcpt-cf-phone" href="tel:'. esc_attr( $field_value ) .'">'. esc_html( $field_value ) .'</a>';
					break;

				case 'email':
					$cf_html .= '<a class="awcpt-cf-email" href="mailto:'. sanitize_email( $field_value ) .'">'. esc_html( $field_value ) .'</a>';
					break;

				case 'pdfLink':
					$label = basename( rtrim( preg_replace("(^https?://)", "", $field_value ), '/' ) );
					$cf_html .= '<a class="awcpt-cf-pdf-link" href="'. esc_url( $field_value ) .'" download="'. esc_attr( basename( $field_value ) ) .'">'. esc_html( $label ) .'</a>';
					break;

				case 'image':
					$cf_html .= '<img class="awcpt-cf-image" src="'. esc_url( $field_value ) .'" alt="'. esc_attr( $column['columnLabel'] ) .'" />';
					break;

				default:
					return;
			}
		} else {
			$cf_html .= '<div class="awcpt-nocfval-msg">'. esc_html__( $no_value_msg, 'product-table-for-woocommerce' ) . '</div>';
		}

	} elseif( $managed_by == 'acf' && function_exists( 'get_field' ) ) {
		$field_value = get_field( $meta_key, $product_id, true );
		$field_object = get_field_object( $meta_key );

		if( $field_value && $field_object ){
			switch ( $field_object['type'] ) {
				case 'link':
					if( $field_object['return_format'] === 'array' && ! empty( $field_value['url'] ) && ! empty( $field_value['title'] ) ) {
						$cf_html .= '<a class="awcpt-acf-link" href="'. esc_url( $field_value['url'] ) .'" target="'. esc_attr( $field_value['target'] ) .'">'. esc_html( $field_value['title'] ) .'</a>';
					} elseif( $field_object['return_format'] === 'url' && ! empty( $field_value ) ) {
						$label = rtrim( preg_replace("(^https?://)", "", $field_value ), '/' );
						$cf_html .= '<a class="awcpt-acf-link" href="'. esc_url( $field_value ) .'">'. esc_html( $label ) .'</a>';
					}
					break;

				case 'file':
					if( $field_object['return_format'] === 'array' ) {
						$cf_html .= '<a class="awcpt-acf-file" href="'. esc_url( $field_value['url'] ) .'" download="'. esc_attr( $field_value['filename'] ) .'">'. esc_html( $field_value['filename'] ) .'</a>';
					}
					break;

				case 'image':
					if( $field_object['return_format'] === 'array' && ! empty( $field_value['url'] ) ) {
						$cf_html .= '<img class="awcpt-acf-image" src="'. esc_url( $field_value['url'] ) .'" alt="'. esc_attr( $column['columnLabel'] ) .'" />';
					}
					break;

				case 'text':
				case 'textarea':
				case 'wysiwyg':
					$cf_html .= '<div class="awcpt-acf-'. esc_attr( $field_object['type'] ) .'">'. wp_kses_post( wpautop( $field_value ) ) .'</div>';
					break;

				case 'email':
					$cf_html .= '<a class="awcpt-acf-email" href="mailto:'. sanitize_email( $field_value ) .'">'. esc_html( $field_value ) .'</a>';
					break;

				case 'number':
					$cf_html .= '<a class="awcpt-acf-phone" href="tel:'. esc_attr( $field_value ) .'">'. esc_html( $field_value ) .'</a>';
					break;

				default:
					return;
			}
		} else {
			$cf_html .= '<div class="awcpt-nocfval-msg">'. esc_html__( $no_value_msg, 'product-table-for-woocommerce' ) . '</div>';
		}

	} else {
		$cf_html .= '<div class="awcpt-nocfval-msg">'. esc_html__( $no_value_msg, 'product-table-for-woocommerce' ) . '</div>';
	}

	$cf_html .= '</div>';
	echo $cf_html;
}
