<?php
$title = ! empty( $prd_data['name'] ) ? $prd_data['name'] : ''; // Ensure $title has a default value
$target = '';
$link_enable = ! empty( $column['link'] ); // Ensure link_enable is a boolean
$open_new_tab = ! empty( $column['newTab'] ); // Ensure open_new_tab is a boolean

if( $open_new_tab ) {
    $target = 'target="_blank"';
}

if( $link_enable ) {
    $link = esc_url( get_the_permalink( $prd_data['id'] ) ); // Sanitize the permalink
    $title_html = '<a class="awcpt-title" href="'.$link.'" '.$target.' title="'.esc_attr( $title ).'">'. esc_html( $title ) .'</a>'; // Sanitize title
} else {
    $title_html = '<span class="awcpt-title">'. esc_html( $title ) .'</span>'; // Sanitize title
}

echo $title_html;
