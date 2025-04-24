if (!document.getElementById('regexlab-panel')) {
    // Create the container panel element
    const panel = document.createElement('div');
    panel.id = 'regexlab-panel';
    panel.style.position = 'fixed';
    panel.style.bottom = '0';
    panel.style.left = '0';
    panel.style.width = '100%';
    panel.style.height = '350px';
    panel.style.zIndex = '999999';
    panel.style.backgroundColor = '#1e1e1e';
    panel.style.color = '#fff';
    panel.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.5)';
    panel.style.overflow = 'auto';


    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = chrome.runtime.getURL('panel.css');
    document.head.appendChild(css);


    // First append the panel to the document
    document.body.appendChild(panel);

    // Then fetch the HTML and load the script
    fetch(chrome.runtime.getURL('panel.html'))
        .then(response => response.text())
        .then(html => {
            panel.innerHTML = html;

            // Now manually load panel.js script
            const script = document.createElement('script');
            script.src = chrome.runtime.getURL('panel.js');
            script.onload = () => console.log('panel.js loaded manually.');
            document.body.appendChild(script); // or panel.appendChild(script);
        })
        .catch(err => {
            console.error('RegexLab panel failed to load:', err);
        });

        document.body.style.overflow = 'auto'; // Re-enable scroll if it was disabled
}
