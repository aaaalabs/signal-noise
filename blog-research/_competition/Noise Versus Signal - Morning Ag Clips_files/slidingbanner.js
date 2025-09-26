jQuery(document).ready(function ($) {
    // $(".utility-bar-right").on("hover", function (e) {
    //     e.preventDefault();
    //     if($('.advertisement-container').is(':hidden')) {
    //         $('.advertisement-container').delay(1000).slideDown(1400);
    //     }
    // });

    // change breadcrumbs of the events pages.
    var url = $(location).attr('href').split('/');
        if(($.inArray('events',url)>0) && ($.inArray('community',url)>0)){
            $('.breadcrumb-link-wrap span').text('Manage Portal');
            $('.breadcrumb-link-wrap a').attr('href','/account-2/');   
        }

    // change text from Expire to Renewal on membership details page.
    $('#account-membership > table > tbody').find('tr:eq(0)').find('.ms-col-expire-date').text('Renewal date');

    // change label Activities to Account Activity on membership details page.
    $('#account-activity h2').remove();
    $('#account-activity').prepend('<h2> Account Activity<a href="/account-2/?action=view_activities" class="ms-all-activities">View all</a></h2>');    

    //SET COOKIE FOR TOGGLE DIV (PREMIUM AD) ON HOMEPAGE
        // cookie was being triggered by the close button on the subscription form, so let's clear out all cookies for now
        // see PS ticket 20085
        $.removeCookie('premiumAd'); 
    if ($.cookie('premiumAd')) {
        $(".advertisement-container").css("display:", "none");
    } else {
        $('.advertisement-container').delay(10000).slideDown(1200);
    }

    // To hide the message but show it again on page reload
    function hideMessage() {
        $('.advertisement-container').delay().slideUp(2000);
    }

    // To hide the hide the message and set the cookie so when the page is reloaded the message does not appear
    function hideForever() {
        $('.advertisement-container').delay().slideUp(1600);
        $.cookie('premiumAd', 'foo', {
            expires: 7
        });
    }

    // Optional function to show message manually on the demo page
    function showMessage() {
        $('.advertisement-container').delay().slideDown(500);
    }

    $(".utility-bar-left").on("hover", function (e) {
        e.preventDefault();
        if ($('.advertisement-container').is(':hidden')) {
            $('.advertisement-container').delay(10000).slideDown(1400);
        } else {}

    });

    $('#triggerClose').on('click', function (e) {
        e.preventDefault();
        hideForever();
    });


    //Invite Friend Form

    document.addEventListener( 'wpcf7mailsent', function( event ) {
        if ( '179661' == event.detail.contactFormId ) {
           $('#invite-form').hide();
           $('.after-invite-content').show();
        }
    }, false );

    $('.after-invite-content').find('button').on('click',function (e) {
        e.preventDefault();
        $(this).parents('.after-invite-content').hide();
        $('#invite-form').show();
    });

    //easy tabs
    $('#login-register-password').easytabs();
    $('#account-management-tabs').easytabs();

    $('.panel_introduction a[href$="#register"]').click(function () {
      $('#login-register-password').easytabs('select', '#register');
    });

    $('.menu-item a[href$="/account/#login"]').click(function () {
      $('#login-register-password').easytabs('select', '#login');
    });

    $('.menu-item a[href$="/account/#register"]').click(function () {
      $('#login-register-password').easytabs('select', '#register');
    });

    $('.panel_introduction a[href$="#reset"]').click(function () {
      $('#login-register-password').easytabs('select', '#reset');
    });

    var validatRegisterForm = function(){
      var validForm = true;
      var $sFirstName = jQuery.trim(jQuery("#mag_user_login").val());
      var $sEmailName = jQuery.trim(jQuery("#mag_user_email").val());
      var $sPassword = jQuery.trim(jQuery("#mag_password").val());
      var $sConfirmPass = jQuery.trim(jQuery("#mag_confirm_password").val());
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

      jQuery( "#mag_user_login" ).nextAll().remove();
      jQuery( "#mag_user_email" ).nextAll().remove();
      jQuery( "#mag_password" ).nextAll().remove();
      jQuery( "#mag_confirm_password" ).nextAll().remove();
      if($sFirstName.length == 0)
      {
        jQuery( "#mag_user_login" ).after( "<span class='error'>User Name Required</span>" );
        validForm =false;
      }
      if($sEmailName.length == 0)
      {
        jQuery( "#mag_user_email" ).after( "<span class='error'>Email Required</span>" );
        validForm =false;
      } else if(!regex.test($sEmailName))
      {
        jQuery( "#mag_user_email" ).after( "<span class='error'>Please Enter valid email</span>" );
        validForm =false;
      }
      if($sPassword.length == 0)
      {
        jQuery( "#mag_password" ).after( "<span class='error'>Password Required</span>" );
        validForm =false;
      }
      if($sConfirmPass.length == 0 )
      {
        jQuery( "#mag_confirm_password" ).after( "<span class='error'>Confirm Password Required</span>" );
        validForm =false;
      }
      else if($sPassword != $sConfirmPass)
      {
        jQuery( "#mag_confirm_password" ).after( "<span class='error'>Password and Confirm Password do not match</span>" );
        validForm =false;
      }
      return validForm;
    };
    jQuery("#mag_register_user_btn").click(function(){
        console.log("click");
      if(validatRegisterForm())
      {

        $sEmail = jQuery.trim(jQuery("#mag_user_email").val());
        $user_name = jQuery.trim(jQuery("#mag_user_login").val());
        jQuery("#register_loder").show();
        jQuery("#mag_register_user_btn").attr("disabled","disabled");

        jQuery.ajax({
          type: "POST",
          url: _APP.ajaxUrl,
          data: { action : 'search_email', email: $sEmail, user_name:$user_name},
          success: function (html)
          {
            var responseData = JSON.parse(html);
            var status = responseData.status;
            var error_message = responseData.email_error ? responseData.email_error : '';
            var user_name = responseData.user_name_error ? responseData.user_name_error : '';
            console.log(error_message);
            console.log(user_name);
            console.log(responseData);
            //window.location.href = urlConfig.home_url+"/my-account/";
            if(status == "success")
            {
              jQuery("#register_mag_form").submit();
              console.log("success");
            }
            else
            {
              jQuery( "#mag_user_email" ).nextAll().remove();
              jQuery( "#mag_user_login" ).nextAll().remove();
              if(error_message != "")
              {
                jQuery( "#mag_user_email" ).focus();
                jQuery( "#mag_user_email" ).after( "<span class='error'>"+error_message+"</span>" );
              }
              if(user_name != "")
              {
                jQuery( "#mag_user_login" ).focus();
                jQuery( "#mag_user_login" ).after( "<span class='error'>"+user_name+"</span>" );
              }

            }
            jQuery("#register_loder").hide();
            jQuery("#mag_register_user_btn").removeAttr("disabled");
          }
        });
      }
      //register_mag_form
    });

    jQuery("#login-btn").click(function(){
      jQuery( "#user_login" ).nextAll().remove();
      jQuery( "#user_pass" ).nextAll().remove();
      $bFormValidate = true;

      if(jQuery("#user_login").val() == "")
      {
        jQuery( "#user_login" ).after( "<span class='error'>Username Required</span>" );
        $bFormValidate = false;
      }
      if(jQuery("#user_pass").val() == "")
      {
        jQuery( "#user_pass" ).after( "<span class='error'>Password Required</span>" );
        $bFormValidate = false;
      }
      if($bFormValidate)
      {
        jQuery("#login-frm").submit();
      }
    });

    jQuery("#reset-pass-btn").click(function(){
      jQuery( "#user_reset_email" ).nextAll().remove();
      jQuery( "#user_pass" ).nextAll().remove();
      $bFormValidate = true;
      if(jQuery("#user_reset_email").val() == "")
      {
        jQuery( "#user_reset_email" ).after( "<span class='error'>Email Required</span>" );
        $bFormValidate = false;
      }
      if($bFormValidate)
      {
        jQuery("#reset-pass-frm").submit();
      }
    });


    /**
     * get_map_category_link
     * @param cate
     * ajax function to get category page url on map state click
     */
    function get_map_category_link(cate) {
        jQuery.post(
            _APP.ajaxUrl, {
                'action': 'add_map_link',
                'data': cate
            },
            function (response) {
                // alert(response);
                window.location = response;
            }
        );
    }

    jQuery(function ($) {
        $('#map').css('visibility', 'hidden');
        $('#map').usmap({
            stateStyles: {
                fill: '#b31b1d'
            },
            stateHoverStyles: {
                fill: '#841213'
            },
            stateSpecificLabelTextStyles: {
                'HI': {
                    fill: '#b31b1d'
                }
            },
            labelBackingStyles: {
                fill: '#b31b1d'
            },
            labelBackingHoverStyles: {
                fill: '#841213'
            },
            clickState: {
                'HI': function (event, data) {
                    get_map_category_link('hawaii');

                },
                'AK': function (event, data) {
                    get_map_category_link('alaska');


                },
                'FL': function (event, data) {
                    get_map_category_link('florida');

                },
                'NH': function (event, data) {
                    get_map_category_link('new_hampshire');


                },
                'MI': function (event, data) {
                    get_map_category_link('michigan');

                },
                'VT': function (event, data) {
                    get_map_category_link('vermont');


                },
                'ME': function (event, data) {
                    get_map_category_link('maine');


                },
                'RI': function (event, data) {
                    get_map_category_link('rhode_island');


                },
                'NY': function (event, data) {
                    get_map_category_link('new_york');


                },
                'PA': function (event, data) {
                    get_map_category_link('pennsylvania');


                },
                'NJ': function (event, data) {
                    get_map_category_link('new_jersey');

                },
                'DE': function (event, data) {
                    get_map_category_link('delaware');


                },
                'MD': function (event, data) {
                    get_map_category_link('maryland');


                },
                'VA': function (event, data) {
                    get_map_category_link('virginia');


                },
                'WV': function (event, data) {
                    get_map_category_link('west_virginia');


                },
                'OH': function (event, data) {
                    get_map_category_link('ohio');


                },
                'IN': function (event, data) {
                    get_map_category_link('indiana');


                },
                'IL': function (event, data) {
                    get_map_category_link('illinois');


                },
                'CT': function (event, data) {
                    get_map_category_link('connecticut');

                },
                'WI': function (event, data) {
                    get_map_category_link('wisconsin');


                },
                'NC': function (event, data) {
                    get_map_category_link('north_carolina');


                },
                'DC': function (event, data) {
                    get_map_category_link('washington_dc');

                },
                'MA': function (event, data) {
                    get_map_category_link('massachusetts');


                },
                'TN': function (event, data) {
                    get_map_category_link('tennessee');

                },
                'AR': function (event, data) {
                    get_map_category_link('arkansas');


                },
                'MO': function (event, data) {
                    get_map_category_link('missouri');


                },
                'GA': function (event, data) {
                    get_map_category_link('georgia');


                },
                'SC': function (event, data) {
                    get_map_category_link('south_carolina');


                },
                'KY': function (event, data) {
                    get_map_category_link('kentucky');


                },
                'AL': function (event, data) {
                    get_map_category_link('alabama');


                },
                'LA': function (event, data) {
                    get_map_category_link('louisiana');


                },
                'MS': function (event, data) {
                    get_map_category_link('mississippi');


                },
                'IA': function (event, data) {
                    get_map_category_link('iowa');

                },
                'MN': function (event, data) {
                    get_map_category_link('minnesota');


                },
                'OK': function (event, data) {
                    get_map_category_link('oklahoma');

                },
                'TX': function (event, data) {
                    get_map_category_link('texas');


                },
                'NM': function (event, data) {
                    get_map_category_link('new_mexico');


                },
                'KS': function (event, data) {
                    get_map_category_link('kansas');

                },
                'NE': function (event, data) {
                    get_map_category_link('nebraska');


                },
                'SD': function (event, data) {
                    get_map_category_link('south_dakota');


                },
                'ND': function (event, data) {
                    get_map_category_link('north_dakota');


                },
                'WY': function (event, data) {
                    get_map_category_link('wyoming');


                },
                'MT': function (event, data) {
                    get_map_category_link('montana');


                },
                'CO': function (event, data) {
                    get_map_category_link('colorado');


                },
                'ID': function (event, data) {
                    get_map_category_link('idaho');


                },
                'UT': function (event, data) {
                    get_map_category_link('utah');


                },
                'AZ': function (event, data) {
                    get_map_category_link('arizona');

                },
                'NV': function (event, data) {
                    get_map_category_link('nevada');


                },
                'OR': function (event, data) {
                    get_map_category_link('oregon');

                },
                'WA': function (event, data) {
                    get_map_category_link('washington');


                },
                'CA': function (event, data) {
                    get_map_category_link('california');

                }
            } // clickState
        });
        $('#map').css('visibility', 'visible');
        $('#map-outer').hide();
    });

    var mapElements = '#map-outer, #map-button';
    $(function () {
        $(mapElements).on('mouseenter mouseleave', function () {
            $('#map-outer').stop().slideToggle();
        });
    });

    $("#quotesWrapper").googleStockQuote({
        stocks: {
            'NYSEARCA:CORN': '<h3>Corn</h3><span class="full_name">Teucrium Corn Fund</span>',
            'NYSEARCA:SOYB': '<h3>Soybeans</h3><span class="full_name">Teucrium Soybean Fund</span>',
            'NYSEARCA:WEAT': '<h3>Wheat</h3><span class="full_name">Teucrium Wheat Fund</span>',
            'NYSEARCA:BAL': '<h3>Cotton</h3><span class="full_name">iPath DJ-UBS Cotton Subindex Total Return SM Index ETN</span>',
            'NYSE:RICE': '<h3>Rice</h3><span class="full_name">Rice Energy Inc</h3>',
            'INDEXDJX:DJUBLCTR': '<h3>Live Cattle</h3><span class="full_name">Dow Jones-UBS Live Cattle Subindex Total Return</span>',
            'INDEXDJX:DJUBSFC': '<h3>Feeder Cattle</h3><span class="full_name">Dow Jones-UBS Feeder Cattle Subindex</span>',
            'INDEXDJX:DJUBSLH': '<h3>Lean Hogs</h3><span class="full_name">Dow Jones-UBS Lean Hogs Subindex</span>'

        },
        showName: true,
        showSymbol: true,
        showlastTradeTime: true,
        showPrice: true,
        showChange: true,
        showChangePercentage: true,
    });

    if (jQuery('#tribe-bar-date').length) {
        //event page filter custom filed Events to
        jQuery("#tribe-bar-date-end").bootstrapDatepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            startDate: ''
        });
        jQuery('#tribe-bar-date').bootstrapDatepicker('setStartDate', '');
        jQuery('#tribe-bar-date').on('changeDate', function (e) {
            console.log(jQuery(this).val());
            jQuery('#tribe-bar-date-end').bootstrapDatepicker('setStartDate', jQuery(this).val());
        });

        jQuery('#tribe-bar-date-end').on('changeDate', function (e) {
            //tribe_events_day_ajax_post();
            jQuery('#tribe-bar-date').bootstrapDatepicker('setEndDate', jQuery(this).val());
            jQuery(".tribe-bar-submit").find(".tribe-events-button").trigger("click");
        });

    }

    //Search toggle (Medium)
    var searchContainer = '#searchBarMedium';
    var searchToggle = '#searchToggleMedium';
    $(searchToggle).on('click tap', function (e) {
        e.preventDefault();
        if (!$(searchContainer).hasClass('open_search') && (!$(searchToggle).hasClass('toggle_active'))) {
            $(searchToggle).addClass('toggle_active');
            $(searchContainer).addClass('open_search');
        } else {
            $(searchContainer).removeClass('open_search');
            //.css({webkitTransform: 'translateY(0px)',transitionDuration: '300ms'});
            $(searchToggle).removeClass('toggle_active');
            //.css({webkitTransform: 'translateY(60px)',transitionDuration: '300ms'});
        }
    });


    /************************************** INVITE A FRIEND FORM ********************************************/
    
    // shows invite more button on invite form submission
    jQuery(document).bind('gform_confirmation_loaded', function(event, formId){
        if(formId == 2) {
            jQuery('.after-invite-content').show();
        } 
    });

    // reload page on invite more button click
    jQuery('.after-invite-content').find('button').on('click',function (e) {
       window.location.replace('/invite-a-friend');
    });

    // move to next field on tab press
    jQuery(document).on('keydown','#input_2_1',function(e){     
        if (e.keyCode === 9 || e.which === 9) {
            e.preventDefault();
            jQuery('#input_2_2').focus();
        }
    });

    // custom validation handling before form submission
    jQuery(document).on('click','#gform_submit_button_2',function(){
        
        // get feilds values
        var $nameValue = jQuery('#input_2_1').val();
        var $messageValue = jQuery('#input_2_3').val();
        var $emailValue = jQuery('#input_2_2').val();
        var $emails = $emailValue.split(',');

        // flag variables
        var $is_error = 0;
        var $is_invalid_email = 0;

        // remove all validation messages
        jQuery(document).find('.gform-custom-error').remove();
        jQuery(document).find('.validation_message').remove();
        jQuery(document).find('.validation_error').remove();
        jQuery(document).find('.ginput_container').removeClass('gfield_error');
        jQuery(document).find('#gform_fields_3 li').removeClass('gfield_error');
            
            // Your name field validation
            if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test($nameValue) || $nameValue.match(/<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/)) {
                jQuery('#input_2_1').focus();
                jQuery('#field_2_1').find('.ginput_container').append('<div class="gform-custom-error">The name entered is invalid.</div>');
                $is_error = 1;
            }

            // Friend's email field validation
            jQuery.each($emails,function(index, item){
                $email = jQuery.trim(item);
                var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
                if (!pattern.test($email)) {
                    $is_error = 1
                    $is_invalid_email = 1;
                }
            });

            // Personal message field validation
            if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test($messageValue) || $messageValue.match(/<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/)) {
                jQuery('#input_2_3').focus();
                jQuery('#field_2_3').find('.ginput_container').append('<div class="gform-custom-error">Personal message contains invalid content.</div>');
                $is_error = 1;
            }

            // check if email field has value
            if ($emailValue === '') {
                $is_invalid_email = 0;
                jQuery('#input_2_2').focus();
                jQuery('#field_2_2').find('.ginput_container').append('<div class="gform-custom-error">The field is required.</div>');
            }

            if ($nameValue === '') {
                jQuery('#input_2_1').focus();
                jQuery('#field_2_1').find('.ginput_container').append('<div class="gform-custom-error">The field is required.</div>');
            }

            if ($is_invalid_email) {
                jQuery('#input_2_2').focus();
                jQuery('#field_2_2').find('.ginput_container').append('<div class="gform-custom-error">The e-mail entered is invalid.</div>');
            }

            if ($is_error) {
                return false;
            }

            jQuery(document).find('#gform_2').submit();
    });

    jQuery(document).on('keydown','#input_2_2',function(e){
        if (e.keyCode === 9 || e.which === 9) {
            if (e.shiftKey) {
                e.preventDefault();
                jQuery('#input_2_1').focus();
            }
        }
    });
    /*********************************************************************************************************/


});


/* slideout menu */
var slideout = new Slideout({
    'panel': document.getElementById('content'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70
});

// Toggle button
document.querySelector('.js-slideout-toggle').addEventListener('click', function () {
    slideout.toggle();
});

slideout.on('open', function () {
    document.body.classList.add("slider-open");
});

slideout.on('close', function () {
    document.body.classList.remove("slider-open");
});

slideout.disableTouch();

//fixed header scripts
var fixed = document.querySelector('.site-header-mobile');

slideout.on('translate', function (translated) {
    fixed.style.transform = 'translateX(' + translated + 'px)';
});

slideout.on('beforeopen', function () {
    fixed.style.transition = 'transform 300ms ease';
    fixed.style.transform = 'translateX(256px)';
});

slideout.on('beforeclose', function () {
    fixed.style.transition = 'transform 300ms ease';
    fixed.style.transform = 'translateX(0px)';
});

slideout.on('open', function () {
    fixed.style.transition = '';
});

slideout.on('close', function () {
    fixed.style.transition = '';
});


/* auto focus on contact form */
jQuery('.wpcf7-text:first').focus();
jQuery('.text-first').focus();


// add character count on submit a press release page's headline field. 
jQuery('document').ready(function ($) {
	if ($('#input_1_2').length) {
		$field_length = $('#input_1_2').val().length;
	}
	else {
		$field_length = 0;	
	}
    $('<div class="charleft ginput_counter custom_char_left">'+$field_length+' of 50 max characters</div>').insertAfter('#input_1_2');
    $('#input_1_2').attr('maxlength',50);
    $('#input_1_2').keyup(function () {
       var CharCount = $('#input_1_2').val().length;
       $('.custom_char_left').remove();
       $('<div class="charleft ginput_counter custom_char_left">'+CharCount+' of 50 max characters</div>').insertAfter('#input_1_2');
    });
});


        
    

