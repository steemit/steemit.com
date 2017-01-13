import config from '../config';
import webPush from 'web-push';
import Tarantool from '../db/tarantool';

webPush.setGCMAPIKey(config.gcm_key);

function notify(account, nparams, title, body, url) {
     var payload = JSON.stringify({
        title,
        body,
        url,
        icon: 'https://steemit.com/favicon.ico'
    });
    return new Promise((resolve, reject) => {
        webPush.sendNotification(nparams, payload).then(function() {
            resolve(account);
        }, function(err) {
            reject(err);
        });
    });
}

async function process_queue() {
    console.log('-- processing web push notifications queue -->');
    try {
        const queue = await Tarantool.instance().call('webpush_get_delivery_queue');
        for (const n of queue) {
            const [account, body, url, nparams_array] = n;
            console.log('-- notification -->', account, body, url);
            for (const nparams of nparams_array) {
                try {
                    await notify(account, nparams, 'Steemit', body, url);
                } catch (err) {
                    console.error('-- error in notify -->', account, err);
                }
            }
            break;
        }
        // console.log('-- run.run -->', queue);
    } catch (error) {
        console.error('-- process_queue error -->', error);
    }
}

function run() {
    process_queue().then(() => {
       setTimeout(run, 30000);
    });
}

run();

