var Calendar = function () {


    return {
        //main function to initiate the module
        init: function () {
            Calendar.initCalendar();
        },

        initCalendar: function () {

            if (!jQuery().fullCalendar) {
                return;
            }

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var h = {};

            if (App.isRTL()) {
                 if ($('#calendar').parents(".portlet").width() <= 720) {
                    $('#calendar').addClass("mobile");
                    h = {
                        right: 'title, prev, next',
                        center: '',
                        right: 'agendaDay, agendaWeek, month, today'
                    };
                } else {
                    $('#calendar').removeClass("mobile");
                    h = {
                        right: 'title',
                        center: '',
                        left: 'agendaDay, agendaWeek, month, today, prev,next'
                    };
                }
            } else {
                if ($('#calendar').parents(".portlet").width() <= 720) {
                    $('#calendar').addClass("mobile");
                    h = {
                        left: 'title, prev, next',
                        center: '',
                        right: 'prev,next,month,agendaWeek'
                    };
                } else {
                    $('#calendar').removeClass("mobile");
                    h = {
                        left: 'title',
                        center: '',
                        right: 'prev,next,month,agendaWeek'
                    };
                }
            }

            $('#calendar').fullCalendar('destroy'); // destroy the calendar
            $('#calendar').fullCalendar({ //re-initialize the calendar
                header: h,
                slotMinutes: 15,
                editable: true,
                droppable: false, // this allows things to be dropped onto the calendar !!!
                drop: function (date, allDay) { // this function is called when something is dropped

                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');
                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;
                    copiedEventObject.className = $(this).attr("data-class");

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                    // is the "remove after drop" checkbox checked?
                    if ($('#drop-remove').is(':checked')) {
                        // if so, remove the element from the "Draggable Events" list
                        $(this).remove();
                    }
                },
                events: [{
                        title: 'Metro Salon Fairview',
                        start: new Date(y, m, 1),
                        url: 'http://google.com/',
                    }, {
                        title: 'Morph Salon',
                        start: new Date(y, m, d - 5),
                        end: new Date(y, m, d - 2),
                        backgroundColor: App.getLayoutColorCode('green'),
                        url: 'http://google.com/',
                    }, {
                        title: 'Contour Salon',
                        start: new Date(y, m, d - 3, 16, 0),
                        allDay: false,
                        backgroundColor: App.getLayoutColorCode('red'),
                    }, {
                        title: 'Salon De Cai',
                        start: new Date(y, m, d + 4, 16, 0),
                        allDay: false,
                        backgroundColor: App.getLayoutColorCode('green'),
                        url: 'http://google.com/',
                    }, {
                        title: 'Vanity Salon',
                        start: new Date(y, m, d, 10, 30),
                        allDay: false,
                        url: 'http://google.com/',
                    }, {
                        title: 'Afford D Nails and Day Spa',
                        start: new Date(y, m, d, 12, 0),
                        end: new Date(y, m, d, 14, 0),
                        backgroundColor: App.getLayoutColorCode('grey'),
                        allDay: false,
                        url: 'http://google.com/',
                    }, {
                        title: 'Shelkea Gorgeous Salon',
                        start: new Date(y, m, d + 1, 19, 0),
                        end: new Date(y, m, d + 1, 22, 30),
                        backgroundColor: App.getLayoutColorCode('purple'),
                        allDay: false,
                        url: 'http://google.com/',
                    }, {
                        title: 'Introspect Hair Salon & Make-up Studio',
                        start: new Date(y, m, 28),
                        end: new Date(y, m, 29),
                        backgroundColor: App.getLayoutColorCode('yellow'),
                        url: 'http://google.com/',
                    }
                ]
            });

        }

    };

}();
