import Component from '../../views/component.js';

class Footer extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`
                <footer class="footer">                   
                    <p class="footer__info">
                        &copy; Alex-Kazimirov, 2021
                    </p>                  
                </footer>
            `);
        });
    }
}

export default Footer;