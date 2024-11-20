<?php
$img_size = sanitize_key($column['imgSize']);
$click_action = sanitize_key($column['clickAction']);
$use_placeholder = isset($column['placeholder']) ? (bool) $column['placeholder'] : false;
$img_zoom = isset($column['zoomImg']) ? (bool) $column['zoomImg'] : false;

if ($product->get_type() == 'variation' && get_post_thumbnail_id($prd_data['id'])) {
    $object_id = $prd_data['id'];
} else {
    $object_id = wp_get_post_parent_id($prd_data['id']);
}

$post_thumbnail_id = get_post_thumbnail_id($object_id);

$prd_img_output = '<div class="awcpt-product-image-wrapper">';
if (!$post_thumbnail_id && $use_placeholder) {
    $img_html = wc_placeholder_img($img_size);
    $lg_img_url = wc_placeholder_img_src('full');
} else {
    $img_html = get_the_post_thumbnail($object_id, $img_size);
    $lg_img_url = get_the_post_thumbnail_url($object_id, 'full');
}

// Sanitize URLs
$permalink = esc_url(get_the_permalink($prd_data['id']));
$lg_img_url = esc_url($lg_img_url);

if ($click_action === 'product_page') {
    $image_main = '<a class="awcpt-product-image" data-awcpt-image-size="' . esc_attr($img_size) . '" href="' . $permalink . '">';
    $image_main .= $img_html;
    $image_main .= '</a>';
} elseif ($click_action === 'product_page_newtab') {

    $image_main = '<a class="awcpt-product-image" data-awcpt-image-size="' . esc_attr($img_size) . '" href="' . $permalink . '" target="_blank">';
    $image_main .= $img_html;
    $image_main .= '</a>';
} elseif ($click_action === 'lightbox') {
    $image_main = '<a class="awcpt-product-image awcpt-prdimage-lightbox" data-awcpt-image-size="' . esc_attr($img_size) . '" href="' . $lg_img_url . '">';
    $image_main .= $img_html;
    $image_main .= '</a>';
} else {
    $image_details = wp_get_attachment_image_src($post_thumbnail_id, $img_size);
    if ($image_details) {
        # code...
        $image_width = $image_details[1];
        $image_width .= "px";
        $image_height = $image_details[2];
        $image_main = "<div style=\"width: $image_width;\">";
        $image_main .= $img_html;
        $image_main .= '</div>';
    }
}

$prd_img_output .= $image_main;
$prd_img_output .= '</div>';

// Output the sanitized product image HTML
echo $prd_img_output;
