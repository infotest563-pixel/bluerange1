<?php
/**
 * Template Name: Flexible Content Page
 */

get_header(); ?>
<link rel="stylesheet" href="https://bluerange.com/wp-content/themes/understrap-child/css/lovable-style.css">
<main class="flex-1">
<script>
document.addEventListener('DOMContentLoaded', function () {
    const toggles = document.querySelectorAll('.faq-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const faqItem = this.closest('.bg-white');
            const content = faqItem.querySelector('.faq-content');
            const icon = this.querySelector('svg');

            // Close all other FAQs
            document.querySelectorAll('.faq-content').forEach(item => {
                if (item !== content) {
                    item.classList.add('hidden');
                    item.previousElementSibling
                        ?.querySelector('.faq-toggle svg')
                        ?.classList.remove('rotate-180');
                }
            });

            // Toggle current FAQ
            content.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });
});
</script>

<?php
if( have_rows('page_sections') ):

    while ( have_rows('page_sections') ) : the_row();


// 11. FAQ SECTION
if( get_row_layout() == 'faq_section' ):
?>

<section class="section-padding bg-secondary">
    <div class="container-bluerange">

        <!-- Section Heading -->
        <div class="text-center mb-16">
            <?php if ( get_sub_field('faq_main_title') ) : ?>
                <h2 class="section-title">
                    <?php the_sub_field('faq_main_title'); ?>
                </h2>
            <?php endif; ?>

            <?php if ( get_sub_field('faq_sub_title') ) : ?>
                <p class="section-subtitle mx-auto">
                    <?php the_sub_field('faq_sub_title'); ?>
                </p>
            <?php endif; ?>
        </div>

        <!-- FAQ Items -->
        <?php if ( have_rows('faqs') ) : ?>
            <div class="max-w-3xl mx-auto">
                <div class="space-y-4" data-orientation="vertical">

                    <?php 
                    $i = 0;
                    while ( have_rows('faqs') ) : the_row(); 
                        $i++;
                        $is_open = ($i === 1);
                    ?>

                    <div class="bg-white rounded-lg px-6 border border-border">
                        <h3 class="flex">
                            <button
                                type="button"
                                aria-expanded="<?php echo $is_open ? 'true' : 'false'; ?>"
                                class="faq-toggle flex flex-1 items-center justify-between py-4 text-left font-semibold text-foreground hover:text-primary transition-all"
                            >
                                <?php the_sub_field('faq_title'); ?>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="h-4 w-4 transition-transform duration-200">
                                    <path d="m6 9 6 6 6-6"></path>
                                </svg>
                            </button>
                        </h3>

                        <div class="faq-content <?php echo $is_open ? '' : 'hidden'; ?>">
                            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
                                <?php the_sub_field('faq_content'); ?>
                            </div>
                        </div>
                    </div>

                    <?php endwhile; ?>

                </div>
            </div>
        <?php endif; ?>

    </div>
</section>
<?php 


        elseif( get_row_layout() == 'hero_section' ):
            $bg_image = get_sub_field('background_image');
            $title = get_sub_field('title');
            $subtitle = get_sub_field('subtitle');
            $btn1_text = get_sub_field('primary_button_text');
            $btn1_link = get_sub_field('primary_button_link');
            $btn2_text = get_sub_field('secondary_button_text');
            ?>
            <section class="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
                <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('<?php echo esc_url($bg_image); ?>');">
                    <div class="absolute inset-0 bg-gradient-to-r from-bluerange-header/90 via-bluerange-header/80 to-bluerange-navy/85"></div>
                </div>
                <div class="relative container-bluerange py-20 lg:py-32">
                    <div class="max-w-3xl">
                        <div class="flex items-center gap-2 text-white/70 text-sm mb-6">
                            <a class="hover:text-white transition-colors" href="<?php echo home_url(); ?>">Home</a>
                            <span>/</span>
                            <span class="text-white"><?php the_title(); ?></span>
                        </div>

                        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            <?php echo esc_html($title); ?>
                        </h1>
                        <p class="text-xl lg:text-2xl text-white/90 leading-relaxed mb-10 max-w-2xl">
                            <?php echo esc_html($subtitle); ?>
                        </p>
                        
                        <div class="flex flex-col sm:flex-row gap-4">
                            <?php if($btn1_link): ?>
                            <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md bg-white text-bluerange-header hover:bg-white/90 text-base px-8 font-semibold" href="<?php echo esc_url($btn1_link); ?>">
                                <?php echo esc_html($btn1_text); ?>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right ml-2 h-5 w-5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                            </a>
                            <?php endif; ?>
                            
                           
                        </div>

                        <?php if( have_rows('hero_features') ): ?>
                        <div class="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/20">
                            <?php while( have_rows('hero_features') ): the_row(); 
                                $f_text = get_sub_field('text');
                            ?>
                            <div class="flex items-center gap-2 text-white/80 text-sm">
                                <div class="w-2 h-2 bg-bluerange-header rounded-full"></div>
                                <?php echo esc_html($f_text); ?>
                            </div>
                            <?php endwhile; ?>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
            </section>

        <?php
        // 2. PRICING SECTION
        elseif( get_row_layout() == 'pricing_section' ):
            $sec_title = get_sub_field('section_title');
            ?>
            <section id="pricing" class="section-padding bg-white">
                <div class="container-bluerange">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl font-bold mb-3">
                            <?php echo esc_html($sec_title); ?>
                        </h2>
                    </div>
                    
                    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <?php if( have_rows('plans') ): ?>
                            <?php while( have_rows('plans') ): the_row(); 
                                $p_name = get_sub_field('plan_name');
                                $is_rec = get_sub_field('is_recommended');
                                $disc_text = get_sub_field('discount_text');
                                $price = get_sub_field('price');
                                $renewal = get_sub_field('renewal_price');
                                $order_link = get_sub_field('order_link');
                                
                                $card_classes = "flex flex-col rounded-2xl text-card-foreground relative overflow-visible bg-white border transition-all border-gray-200 p-6 hover:shadow-lg";
                                $btn_classes = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-bluerange-header px-4 w-full py-2 text-sm font-semibold tracking-wide bg-border hover:bg-border/90 text-black hover:text-foreground hover:decoration-none mt-auto";
                                
                                if($is_rec) {
                                    $card_classes = "flex flex-col rounded-2xl text-card-foreground relative overflow-visible bg-white border-2 border-bluerange-header transition-all p-6 hover:shadow-lg";
                                    $btn_classes = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 w-full py-2 text-sm font-semibold tracking-wide bg-bluerange-header hover:bg-bluerange-header/90 text-white hover:text-foreground hover:decoration-none mt-auto";
                                }
                            ?>
                            <div class="<?php echo $card_classes; ?>">
                                <?php if($is_rec): ?>
                                <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-bluerange-header text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                                    Recommended
                                </div>
                                <?php endif; ?>
                                
                                <div class="flex flex-col">
                                    <div>
                                        <span class="text-muted-foreground text-sm">
                                            <?php echo esc_html($disc_text); ?>
                                        </span>
                                    </div>
                                    <h3 class="text-2xl font-bold text-foreground uppercase tracking-wide">
                                        <?php echo esc_html($p_name); ?>
                                    </h3>
                                    
                                    <!-- Plan level indicators (simplified) -->
                                    <div class="flex gap-1 mb-2">
                                        <div class="h-2 w-12 rounded bg-bluerange-header"></div>
                                        <div class="h-2 w-12 rounded <?php echo ($p_name == 'Business' || $p_name == 'Corporate') ? 'bg-bluerange-header' : 'bg-gray-200'; ?>"></div>
                                        <div class="h-2 w-12 rounded <?php echo ($p_name == 'Corporate') ? 'bg-bluerange-header' : 'bg-gray-200'; ?>"></div>
                                        <div class="h-2 w-12 rounded <?php echo ($p_name == 'Corporate') ? 'bg-bluerange-header' : 'bg-gray-200'; ?>"></div>
                                    </div>

                                    <div class="mb-6">
                                        <span class="text-sm text-bluerange-header">*As low as</span>
                                    </div>

                                    <div class="flex items-baseline gap-1">
                                        <span class="text-4xl font-bold text-foreground"><?php echo esc_html($price); ?></span>
                                        <span class="text-lg text-muted-foreground">/mo</span>
                                    </div>
                                    <div class="text-sm text-muted-foreground mt-1"><?php echo esc_html($renewal); ?></div>
                                </div>
                                
<ul class="space-y-3 my-4 pt-4 border-top">
    <?php if (have_rows('features')) : ?>
        <?php while (have_rows('features')) : the_row();
            $hi = get_sub_field('highlight');
            $dt = get_sub_field('detail');
        ?>
            <li class="flex items-start gap-3">

                <div class="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="24"
                         height="24"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         stroke-width="2"
                         stroke-linecap="round"
                         stroke-linejoin="round"
                         class="h-5 w-5 text-bluerange-header shrink-0 mt-0.5">
                        <path d="M20 6 9 17l-5-5"></path>
                    </svg>

                    <span class="text-sm text-foreground">
                        <span class="font-semibold">
                            <?php echo esc_html($hi); ?>
                        </span>

                        <span class="text-muted-foreground">
                            <?php echo esc_html($dt); ?>
                        </span>
                    </span>

                </div>

            </li>
        <?php endwhile; ?>
    <?php endif; ?>
</ul>


								<!-- AlpineJS (läggs en gång per sida) -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
	
								
								
								

                                <a class="<?php echo $btn_classes; ?> custom_btn_blue" href="<?php echo esc_url($order_link); ?>">
                                    Order Now
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                </a>
                            </div>
                            <?php endwhile; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </section>

        <?php
        // 3. FEATURES GRID (Human Touch)
        elseif( get_row_layout() == 'features_grid' ):
            $title = get_sub_field('title');
            $subtitle = get_sub_field('subtitle');
            ?>
            <section class="section-padding bg-background">
                <div class="container-bluerange">
                    <div class="text-center mb-16">
                        <h2 class="section-title"><?php echo esc_html($title); ?></h2>
                        <p class="section-subtitle mx-auto"><?php echo esc_html($subtitle); ?></p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <?php 
                        $delay = 0;
                        if( have_rows('items') ):
                            while( have_rows('items') ): the_row();
                                $icon = get_sub_field('icon');
                                $f_title = get_sub_field('title');
                                $f_desc = get_sub_field('description');
                        ?>
                        <div class="rounded-lg text-card-foreground border-0 shadow-lg hover:shadow-xl transition-shadow bg-card group" style="animation-delay: <?php echo $delay; ?>ms;">
                            <div class="p-8">
                                <div class="w-14 h-14 rounded-xl bg-bluerange-teal-light flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                                    <?php echo $icon; // Raw output for SVG ?>
                                </div>
                                <h3 class="text-xl font-semibold mb-3 text-foreground"><?php echo esc_html($f_title); ?></h3>
                                <p class="text-muted-foreground leading-relaxed"><?php echo esc_html($f_desc); ?></p>
                            </div>
                        </div>
                        <?php 
                                $delay += 100;
                            endwhile;
                        endif; 
                        ?>
                    </div>
                </div>
            </section>

        <?php
        // 4. SPEED & GROWTH SECTION
        elseif( get_row_layout() == 'speed_growth' ):
            $title = get_sub_field('title');
            $subtitle = get_sub_field('subtitle');
            $uptime_pct = get_sub_field('uptime_percentage');
            $uptime_lbl = get_sub_field('uptime_label');
            ?>
            <section class="section-padding bg-secondary">
                <div class="container-bluerange">
                    <div class="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 class="section-title"><?php echo esc_html($title); ?></h2>
                            <p class="section-subtitle mb-10"><?php echo esc_html($subtitle); ?></p>
                            
                            <div class="space-y-6">
                                <?php if( have_rows('features') ): while( have_rows('features') ): the_row(); 
                                    $icon = get_sub_field('icon');
                                    $f_title = get_sub_field('title');
                                    $f_desc = get_sub_field('description');
                                ?>
                                <div class="flex gap-4">
                                    <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <?php echo $icon; ?>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-foreground mb-1"><?php echo esc_html($f_title); ?></h3>
                                        <p class="text-muted-foreground text-sm"><?php echo esc_html($f_desc); ?></p>
                                    </div>
                                </div>
                                <?php endwhile; endif; ?>
                            </div>
                        </div>
                        
                        <div class="relative">
                            <div class="aspect-square rounded-2xl bg-gradient-to-br from-primary/5 to-bluerange-navy/10 p-8 flex items-center justify-center">
                                <div class="relative w-full h-full">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <div class="text-center">
                                            <div class="text-6xl font-bold text-primary mb-2"><?php echo esc_html($uptime_pct); ?></div>
                                            <div class="text-muted-foreground font-medium"><?php echo esc_html($uptime_lbl); ?></div>
                                        </div>
                                    </div>
                                    <div class="absolute inset-0">
                                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-primary/20"></div>
                                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-primary/10"></div>
                                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-primary/5"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        <?php
        // 5. SECURITY SECTION
        elseif( get_row_layout() == 'security_section' ):
            $title = get_sub_field('title');
            $subtitle = get_sub_field('subtitle');
            $img_url = get_sub_field('image');
            $ov_title = get_sub_field('overlay_title');
            $ov_sub = get_sub_field('overlay_subtitle');
            ?>
            <section class="section-padding bg-background">
                <div class="container-bluerange">
                    <div class="grid lg:grid-cols-2 gap-16 items-center">
                        <div class="relative order-2 lg:order-1">
                            <div class="aspect-[4/3] rounded-2xl overflow-hidden bg-bluerange-navy relative">
                                <div class="absolute inset-0 bg-cover bg-center opacity-30" style="background-image: url('<?php echo esc_url($img_url); ?>');"></div>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="text-center text-white p-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield h-20 w-20 mx-auto mb-6 text-primary"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
                                        <h3 class="text-2xl font-bold mb-2"><?php echo esc_html($ov_title); ?></h3>
                                        <p class="text-white/70"><?php echo esc_html($ov_sub); ?></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="order-1 lg:order-2">
                            <h2 class="section-title"><?php echo esc_html($title); ?></h2>
                            <p class="section-subtitle mb-10"><?php echo esc_html($subtitle); ?></p>
                            
                            <div class="grid gap-4">
                                <?php if( have_rows('security_features') ): while( have_rows('security_features') ): the_row(); 
                                    $icon = get_sub_field('icon');
                                    $text = get_sub_field('text');
                                ?>
                                <div class="flex items-center gap-4 p-4 rounded-lg bg-bluerange-green-light hover:bg-bluerange-teal-light transition-colors">
                                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <?php echo $icon; ?>
                                    </div>
                                    <span class="text-foreground font-medium"><?php echo esc_html($text); ?></span>
                                </div>
                                <?php endwhile; endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        <?php
        // 6. SUSTAINABILITY SECTION
        elseif( get_row_layout() == 'sustainability_section' ):
            $top_lbl = get_sub_field('top_label');
            $title = get_sub_field('title');
            $subtitle = get_sub_field('subtitle');
            ?>
            <section class="section-padding bg-bluerange-header/10 relative overflow-hidden">
                <div class="absolute inset-0 opacity-30">
                    <div class="absolute top-20 left-10 w-32 h-32 rounded-full bg-bluerange-header/20"></div>
                    <div class="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-bluerange-header/15"></div>
                    <div class="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-primary/10"></div>
                </div>
                
                <div class="container-bluerange relative">
                    <div class="text-center mb-16">
                        <div class="inline-flex items-center gap-2 bg-bluerange-header/10 text-bluerange-header px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf h-4 w-4"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
                            <?php echo esc_html($top_lbl); ?>
                        </div>
                        <h2 class="section-title"><?php echo esc_html($title); ?></h2>
                        <p class="section-subtitle mx-auto"><?php echo esc_html($subtitle); ?></p>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
                        <?php if( have_rows('energy_sources') ): while( have_rows('energy_sources') ): the_row(); 
                            $icon = get_sub_field('icon');
                            $text = get_sub_field('title');
                        ?>
                        <div class="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div class="w-14 h-14 rounded-full bg-bluerange-header/10 flex items-center justify-center mb-4">
                                <?php echo $icon; ?>
                            </div>
                            <span class="text-sm font-medium text-foreground"><?php echo esc_html($text); ?></span>
                        </div>
                        <?php endwhile; endif; ?>
                    </div>
                    
                    <div class="grid md:grid-cols-3 gap-8 bg-white rounded-2xl p-8 shadow-lg">
                        <?php if( have_rows('stats') ): while( have_rows('stats') ): the_row(); 
                            $val = get_sub_field('value');
                            $lbl = get_sub_field('label');
                        ?>
                        <div class="text-center">
                            <div class="text-4xl font-bold text-bluerange-header mb-2"><?php echo esc_html($val); ?></div>
                            <div class="text-muted-foreground"><?php echo esc_html($lbl); ?></div>
                        </div>
                        <?php endwhile; endif; ?>
                    </div>
                </div>
            </section>

        <?php
        // 7. SUPPORT SECTION
        elseif( get_row_layout() == 'support_section' ):
            $title = get_sub_field('title');
            $subtitle = get_sub_field('subtitle');
            $btn_text = get_sub_field('button_text');
            $btn_link = get_sub_field('button_link');
            ?>
            <section class="section-padding bg-bluerange-navy text-white">
                <div class="container-bluerange">
                    <div class="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 class="text-3xl md:text-4xl font-bold mb-4"><?php echo esc_html($title); ?></h2>
                            <p class="text-white/70 text-lg mb-10 max-w-xl"><?php echo esc_html($subtitle); ?></p>
                            
                            <div class="space-y-6 mb-10">
                                <?php if( have_rows('support_features') ): while( have_rows('support_features') ): the_row(); 
                                    $icon = get_sub_field('icon');
                                    $f_title = get_sub_field('title');
                                    $f_desc = get_sub_field('description');
                                ?>
                                <div class="flex gap-4">
                                    <div class="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                        <?php echo $icon; ?>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-white mb-1"><?php echo esc_html($f_title); ?></h3>
                                        <p class="text-white/60 text-sm"><?php echo esc_html($f_desc); ?></p>
                                    </div>
                                </div>
                                <?php endwhile; endif; ?>
                            </div>
                            
                            <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-11 rounded-md px-8 bg-primary hover:bg-primary/90" href="<?php echo esc_url($btn_link); ?>">
                                <?php echo esc_html($btn_text); ?>
                            </a>
                        </div>
                        
                        <div class="relative">
                            <div class="aspect-square max-w-md mx-auto">
                                <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full"></div>
                                <div class="absolute inset-8 bg-gradient-to-br from-primary/30 to-transparent rounded-full"></div>
                                <div class="absolute inset-16 bg-gradient-to-br from-primary/40 to-transparent rounded-full flex items-center justify-center">
                                    <div class="text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones h-20 w-20 text-primary mx-auto mb-4"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path></svg>
                                        <div class="text-3xl font-bold">24/7</div>
                                        <div class="text-white/70">Human Support</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        <?php
        // 8. FEATURES GRID 2 (Reliable Hosting)
        elseif( get_row_layout() == 'features_grid_2' ):
            $title = get_sub_field('main_title');
            $subtitle = get_sub_field('subtitle');
            ?>
            <section class="section-padding bg-background">
                <div class="container-bluerange">
                    <div class="text-center mb-16">
                        <h2 class="section-title"><?php echo esc_html($title); ?></h2>
                        <p class="section-subtitle mx-auto"><?php echo esc_html($subtitle); ?></p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <?php if( have_rows('items') ): while( have_rows('items') ): the_row(); 
                            $icon = get_sub_field('icon');
                            $f_title = get_sub_field('title');
                            $f_desc = get_sub_field('description');
                        ?>
                        <div class="group p-8 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all">
                            <div class="w-14 h-14 rounded-xl bg-bluerange-teal-light group-hover:bg-primary/10 flex items-center justify-center mb-6 transition-colors">
                                <?php echo $icon; ?>
                            </div>
                            <h3 class="text-xl font-semibold mb-3 text-foreground"><?php echo esc_html($f_title); ?></h3>
                            <p class="text-muted-foreground leading-relaxed"><?php echo esc_html($f_desc); ?></p>
                        </div>
                        <?php endwhile; endif; ?>
                    </div>
                </div>
            </section>

        <?php
        // 9. TRUST SECTION
        elseif( get_row_layout() == 'trust_section' ):
            $title = get_sub_field('title');
            $subtitle = get_sub_field('subtitle');
            ?>
            <section class="section-padding bg-background">
                <div class="container-bluerange">
                    <div class="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 class="section-title"><?php echo esc_html($title); ?></h2>
                            <p class="section-subtitle mb-10"><?php echo esc_html($subtitle); ?></p>
                            
                            <div class="space-y-4">
                                <?php if( have_rows('trust_items') ): while( have_rows('trust_items') ): the_row(); 
                                    $icon = get_sub_field('icon');
                                    $text = get_sub_field('text');
                                ?>
                                <div class="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <?php echo $icon; ?>
                                    </div>
                                    <span class="text-foreground font-medium"><?php echo esc_html($text); ?></span>
                                </div>
                                <?php endwhile; endif; ?>
                            </div>
                        </div>
                        
                        <div class="relative">
                            <div class="aspect-[4/3] rounded-2xl bg-bluerange-teal-light overflow-hidden">
                                <div class="absolute inset-0 p-8">
                                    <!-- Map SVG (Hardcoded as it's complex) -->
                                    <svg viewBox="0 0 200 250" class="w-full h-full" fill="none">
                                        <path d="M100 10 L130 30 L140 80 L160 120 L150 180 L120 240 L80 240 L60 200 L50 150 L60 100 L80 50 Z" class="fill-primary/10 stroke-primary/30" stroke-width="2"></path>
                                        <g class="animate-pulse">
                                            <circle cx="95" cy="170" r="8" class="fill-primary"></circle>
                                            <circle cx="95" cy="170" r="14" class="fill-primary/20"></circle>
                                            <circle cx="110" cy="190" r="8" class="fill-bluerange-green"></circle>
                                            <circle cx="110" cy="190" r="14" class="fill-bluerange-green/20"></circle>
                                            <circle cx="80" cy="210" r="8" class="fill-primary"></circle>
                                            <circle cx="80" cy="210" r="14" class="fill-primary/20"></circle>
                                        </g>
                                        <path d="M95 170 L110 190 M110 190 L80 210 M80 210 L95 170" class="stroke-primary/40" stroke-width="1" stroke-dasharray="4 2"></path>
                                    </svg>
                                    <div class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                                        <div class="flex justify-around text-sm">
                                            <div class="text-center">
                                                <div class="w-3 h-3 rounded-full bg-primary mx-auto mb-1"></div>
                                                <span class="text-foreground font-medium">Jönköping</span>
                                            </div>
                                            <div class="text-center">
                                                <div class="w-3 h-3 rounded-full bg-bluerange-green mx-auto mb-1"></div>
                                                <span class="text-foreground font-medium">Växjö</span>
                                            </div>
                                            <div class="text-center">
                                                <div class="w-3 h-3 rounded-full bg-primary mx-auto mb-1"></div>
                                                <span class="text-foreground font-medium">Helsingborg</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        <?php
        // 10. CTA SECTION
        elseif( get_row_layout() == 'cta_section' ):
            $title = get_sub_field('title');
            $text = get_sub_field('text');
            $btn_text = get_sub_field('button_text');
            $btn_link = get_sub_field('button_link');
            $phone_button_text = get_sub_field('phone_button_text');
            $phone_button_link = get_sub_field('phone_button_link');
            $footer_text = get_sub_field('footer_text');
            ?>
            <section class="section-padding bg-primary relative overflow-hidden">
                <div class="absolute inset-0 opacity-10">
                    <div class="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2"></div>
                    <div class="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-white/20 translate-x-1/3 translate-y-1/3"></div>
                </div>
                <div class="container-bluerange relative text-center">
                    <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
                        <?php echo esc_html($title); ?>
                    </h2>
                    <p class="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                        <?php echo esc_html($text); ?>
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md bg-white text-primary hover:bg-white/90 text-base px-10" href="<?php echo esc_url($btn_link); ?>">
                            <?php echo esc_html($btn_text); ?>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right ml-2 h-5 w-5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </a>
<?php if($phone_button_text &&  $phone_button_link) { ?>
<a href="<?php echo $phone_button_link;?>" class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border bg-background hover:text-accent-foreground h-11 rounded-md border-white text-white hover:bg-white/10 text-base px-8"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone mr-2 h-5 w-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg><?php echo $phone_button_text;?></a>
						<?php } ?>
                    </div>
                    <p class="text-white/60 text-sm mt-8">
                        <?php echo esc_html($footer_text); ?>
                    </p>
                </div>
            </section>

        <?php
        endif; // End of flexible content layouts
    endwhile;
endif;
?>

</main>

<?php get_footer(); ?>