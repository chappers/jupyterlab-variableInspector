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
        console.log("kernel_type: " + this._session.kernel.info.language_info.name);
        return this._session.kernel.info.language_info.name;
    }


    /**
     *  A Promise that is fulfilled when the session associated w/ the connector is ready.
     */
    get ready(): Promise<void> {
        // this._session.kernel.info.language_info.name
        this._session.kernel.requestComplete({
            code: 'hello',
            cursor_pos: 4
          }).then(() => {
            return this._session.ready;
          });
        
        return this._session.ready;
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
            console.log("kernel_request: " + kernel.info.language_info.name);

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