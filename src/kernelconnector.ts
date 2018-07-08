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


    kerneltype(): string {
        console.log("kernel name:"+this._session.kernel.id);
        console.log("kernel name:"+this._session.kernel.name);
        console.log("kernel username:"+this._session.kernel.username);
        console.log("kernel clientId:"+this._session.kernel.clientId);
        try {
            console.log("kernel language:"+this._session.kernel.info.language_info.name);
        } catch (e) {
            console.log(e);
        }
        try {
            return this._session.kernel.info.language_info.name
        } catch (e) {
            console.log(e);
        }
        return this._session.kernel.name;
    }

    /**
     *  A Promise that is fulfilled when the session associated w/ the connector is ready.
     */
    get ready(): Promise<void> {
        return this._session.ready;
    }

    kernelReady(): Boolean {
        return this._session.kernel.isReady
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
            try {
                const lang = this._session.kernel.info.language_info;
                console.log("kernel ready and language:" + lang);
                console.log("kernel ready and language:" + lang.version);
                console.log("kernel ready and language:" + lang.name);
                console.log("kernel ready and language:" + lang.file_extension);
                //this._lang = lang.name
            } catch (e) {
                console.log(e);
            }
            
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