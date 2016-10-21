import TarantoolDriver from 'tarantool-driver';

let instance = null;

class Tarantool {
    constructor() {
        console.log('-- Tarantool.constructor -->');
        const connection = this.connection = new TarantoolDriver({port: 3313});
        this.ready_promise = new Promise((resolve, reject) => {
            connection.connect()
            .then(() => connection.auth('guest', ''))
            .then(() => resolve())
            .catch(error => reject(error));
        });
    }

    makeCall(call_name, args) {
        return this.ready_promise
            .then(() => this.connection[call_name].apply(this.connection, args))
            .catch(error => {
                console.error('Tarantool error', error.message);
                if (error.message.indexOf('connection') >= 0)
                    instance = null;
                return Promise.reject(error);
            });
    }

    select() {
       return this.makeCall('select', arguments);
    }
    delete() {
        return this.makeCall('delete', arguments);
    }
    insert() {
        return this.makeCall('insert', arguments);
    }
    replace() {
        return this.makeCall('replace', arguments);
    }
    update() {
        return this.makeCall('update', arguments);
    }
    eval() {
        return this.makeCall('eval', arguments);
    }
    call() {
        return this.makeCall('call', arguments);
    }
    upsert() {
        return this.makeCall('upsert', arguments);
    }
}

Tarantool.instance = function () {
    if (!instance) instance = new Tarantool();
    return instance;
};

export default Tarantool;
