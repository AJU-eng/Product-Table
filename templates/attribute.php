<?php 

// if not selected attribute
if( empty( $column['taxonomy'] ) ){
	return;
} else {
    $attribute_name = esc_html( $column['taxonomy'] );
}

$attribute_tax_name = wc_attribute_taxonomy_name( $attribute_name );

if( ! empty( $column['separator'] ) ){
    $terms_separator = esc_html( $column['separator'] );
} else {
    $terms_separator = ', ';
}

if( ! empty( $column['noTermsMsg'] ) ){
    $no_terms_msg = esc_html( $column['noTermsMsg'] );
} else {
    $no_terms_msg = 'Attributes not found!';
}

$prd_attributes = $product->get_attributes();
$prd_attribute_object = '';

if( $prd_attributes && isset( $prd_attributes[$attribute_tax_name] ) ){
    $prd_attribute_object = $prd_attributes[$attribute_tax_name];
} elseif( $prd_attributes && isset( $prd_attributes[$attribute_name] ) ){
    $prd_attribute_object = $prd_attributes[$attribute_name];
}

if( empty( $prd_attribute_object ) ){
	$terms = false;
} elseif( $prd_attribute_object && $prd_attribute_object->is_taxonomy() ){
	$terms = wc_get_product_terms( $product->get_id(), $prd_attribute_object->get_name(), array( 'fields' => 'all', 'orderby' => 'menu_id' ) );
} else {
	$terms = $prd_attribute_object->get_options();
}

$attributes_html = '<div class="awcpt-attributes">';
if( $terms ){
    $i = 0;
    $terms_count = count( $terms );
    $attributes_html .= '<p>';
    foreach( $terms as $term ){
        $attributes_html .= esc_html( $term->name );
        if( $i < ( $terms_count - 1 ) ){
            $attributes_html .= esc_html( $terms_separator );
        }
        $i++;
    }
    $attributes_html .= '</p>';
} else {
    $attributes_html .= '<div class="awcpt-attr-notfound">'.esc_html( $no_terms_msg ).'</div>';
}
$attributes_html .= '</div>';

echo wp_kses_post($attributes_html);
