<?php
$product_id = $prd_data['id'];

// Sanitize separator and not found message
$tag_separator = ! empty( $column['separator'] ) ? sanitize_text_field( $column['separator'] ) : ', ';
$tags_notfound_msg = ! empty( $column['noTagsMsg'] ) ? sanitize_text_field( $column['noTagsMsg'] ) : 'Tags not found!';

$tags = get_the_terms( $product_id, 'product_tag' );
$tags_html = '<div class="awcpt-tags">';

if( $tags ){
    $i = 0;
    $tags_count = count( $tags );
    $tags_html .= '<p>';
    foreach( $tags as $tag ){
        $tags_html .= esc_html( $tag->name );
        if( $i < ( $tags_count - 1 ) ){
            $tags_html .= esc_html( $tag_separator );
        }
        $i++;
    }
    $tags_html .= '</p>';
} else {
    $tags_html .= '<div class="awcpt-tags-notfound">' . esc_html__( $tags_notfound_msg, 'product-table-for-woocommerce' ) . '</div>';
}

$tags_html .= '</div>';

echo $tags_html;
