import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import "./modal.css";

const ModalDialog = ({ isOpen, onClose, children }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='modal-wrapper' onClose={onClose}>
        <div className='modal-backdrop' />

        <div className='modal-positioner'>
          <Transition.Child
            as={Fragment}
            enter='modal-enter'
            enterFrom='modal-from'
            enterTo='modal-to'
            leave='modal-leave'
            leaveFrom='modal-to'
            leaveTo='modal-from'>
            <Dialog.Panel className='modal-panel'>{children}</Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalDialog;
