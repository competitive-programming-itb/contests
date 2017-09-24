$(function() {
    $('.contest-tab').on('shown.bs.tab', function(e) {
        var target = $(e.target);
        var relatedTarget = $(e.relatedTarget);
        // Remove all active class on hidden tab
        $(relatedTarget.attr('href')).find('.active').removeClass('active');
        // Show #overview
        $(target.attr('href')).find('[data-toggle="tab"]').first().tab('show');
    });
    $('.problem-link').on('click', function(e) {
        e.preventDefault();
        console.log($(this).attr('href'));
        $($(this).attr('href')).tab('show');
    });
    $('.problem-tab').on('shown.bs.tab', function(e) {
        $($(e.target).attr('href')).find('[data-toggle="list"]').first().tab('show');
    });
    $('.ajaxfileloader').on('shown.bs.tab', function(e) {
        var target = $($(e.target).attr('href'));

        // Load file
        if (target.data('fileloaded') === 'true') {
            return;
        }
        loadFile(target.data('filesource'), target, function(err) {
            if (!err) {
                target.data('fileloaded', 'true');
            }
        });
    });
});

function loadFile(source, target, callback) {
    $.get(source)
        .done(function(res) {
            var escaped = $('<div/>').text(res).html()
            var format = source.split('.').pop();
            if (format === 'md') {
                var html = new showdown.Converter({
                    tables: true,
                }).makeHtml(escaped);
                target.html('<div class="markdown-body">' + html + '</div>');
            } else {
                target.html('<pre><code class="' + format + '">' + escaped + '</code></pre>');
                target.find('pre code').each(function(_, block) {
                    hljs.highlightBlock(block);
                });
            }
            if (callback) {
                callback(null, escaped);
            }
        })
        .fail(function(err) {
            if (callback) {
                callback(err);
            }
        });
}