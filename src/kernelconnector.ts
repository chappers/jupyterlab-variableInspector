import {
    IClientSession
} from "@jupyterlab/apputils";

/*
import {
    DataConnector//, nbformat
} from "@jupyterlab/coreutils";
*/
import {
    KernelMessage, Kernel
} from "@jupyterlab/services";

import {
    ISignal//, Signal, Slot
} from "@phosphor/signaling";


/**
 * Connector class that handles execute request to a kernel
 */
export
    class KernelConnector {

    private _session: IClientSession;

    constructor( options: KernelConnector.IOptions ) {
        this._session = options.session;
    }


    get kerneltype(): string {
        try {
            console.log("session name: " + this._session.name);
            console.log("session kernel name: " + this._session.kernel.name);
        } catch(e) {
            console.log(e);
        }
        
        try {
            console.log("session language info name: " + this._session.kernel.info.language_info.name);
            return this._session.kernel.info.language_info.name;
        } catch(e) {
            console.log(e);
        } finally {
            console.log("session kernel name: " + this._session.kernel.name);
            return this._session.kernel.name;
        }
    }


    /**
     *  A Promise that is fulfilled when the session associated w/ the connector is ready.
     */
    get ready(): Promise<void> {
        try {
            console.log("session ready name:" + this._session.name);
            console.log("session ready isready: " + this._session.kernel.isReady);
        } catch (e) {
            console.log(e);
        }

        try {
            console.log("session ready kernel isready: " + this._session.kernel.isReady);
        } catch(e) {
            console.log(e);
            console.log("session ready session isready: " + this._session.isReady);
        }        

        try {
            return this._session.kernel.ready;
        } catch(e) {
            console.log(e);
        } finally {
            return this._session.ready;
        }
        
    }

    /**
     *  A signal emitted for iopub messages of the kernel associated with the kernel.
     */
    get iopubMessage(): ISignal<IClientSession, KernelMessage.IMessage> {
        return this._session.iopubMessage;
    }



    /**
     * Executes the given request on the kernel associated with the connector.
     * @param request: IExecuteRequest to forward to the kernel.
     * @returns Promise<KernelMessage.IExecuteReplyMsg>
     */
    fetch( request: KernelMessage.IExecuteRequest, ioCallback: ( msg: KernelMessage.IIOPubMessage ) => any ): Promise<KernelMessage.IExecuteReplyMsg> {
        const kernel = this._session.kernel;
        if ( !kernel ) {
            return Promise.reject( new Error( "Require kernel to perform variable inspection!" ) );
        }


        return kernel.ready.then(() => {
            let future: Kernel.IFuture = kernel.requestExecute( request );

            future.onIOPub = ( ( msg: KernelMessage.IIOPubMessage ) => {
                ioCallback( msg );
            } );
            return future.done as Promise<KernelMessage.IExecuteReplyMsg>;
        } );
    }

}

export
namespace KernelConnector {
    export
        interface IOptions {
        session: IClientSession;

    }
}