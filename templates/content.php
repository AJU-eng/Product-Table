<?php
$word_limit = absint($column['wordCount']);
if( sanitize_text_field($product->get_type() == 'variation' )){
   $content = $product->get_description();
} else {
   $content = get_the_content();
}

if( !$content ){
	return;
}

if( ! empty( $word_limit ) ){
	$content = wp_filter_nohtml_kses( $content );
	preg_match( "/(?:\w+(?:\W+|$)){0,$word_limit}/", $content, $matches );
	$trimed_content = rtrim( $matches[0], ' ,.' ) ;
	if( strlen( $content ) > strlen( $trimed_content ) ){
		$trimed_content .= '...';
	}
	$content = $trimed_content;
}

$content_html = '<div class="awcpt-content">';
$content_html .= wpautop( do_shortcode( $content ) );
$content_html .= '</div>';

echo wp_kses_post($content_html);