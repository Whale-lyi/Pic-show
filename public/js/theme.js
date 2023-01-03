function change_theme(color) {
    let button1 = document.getElementsByTagName('button')[1];
    let button2 = document.getElementsByClassName('user')[0];
    if (color === 'light') {
        document.body.className = 'light_theme_body';
        button1.className = 'button light_theme_button';
        button2.className = 'user light_theme_button';
    } else if (color === 'dark') {
        document.body.className = 'dark_theme_body';
        button1.className = 'button dark_theme_button';
        button2.className = 'user dark_theme_button';
    }
}