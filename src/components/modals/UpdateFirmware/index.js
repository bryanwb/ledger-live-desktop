// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T, Device } from 'types/common'

import Modal from 'components/base/Modal'
import Stepper from 'components/base/Stepper'
import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'

import type { StepProps as DefaultStepProps, Step } from 'components/base/Stepper'
import type { ModalStatus } from 'components/ManagerPage/FirmwareUpdate'
import type { LedgerScriptParams } from 'helpers/common'

import StepFullFirmwareInstall from './steps/01-step-install-full-firmware'
import StepFlashMcu from './steps/02-step-flash-mcu'
import StepConfirmation, { StepConfirmFooter } from './steps/03-step-confirmation'

export type Firmware = LedgerScriptParams & { shouldUpdateMcu: boolean }

export type StepProps = DefaultStepProps & {
  firmware: Firmware,
  onCloseModal: () => void,
  installOsuFirmware: (device: Device) => void,
  installFinalFirmware: (device: Device) => void,
  flashMCU: (device: Device) => void,
}

type StepId = 'idCheck' | 'updateMCU' | 'finish'

const createSteps = ({ t, firmware }: { t: T, firmware: Firmware }): Array<*> => {
  const updateStep = {
    id: 'idCheck',
    label: t('app:manager.modal.steps.idCheck'),
    component: StepFullFirmwareInstall,
    footer: null,
    onBack: null,
    hideFooter: true,
  }

  const finalStep = {
    id: 'finish',
    label: t('app:addAccounts.breadcrumb.finish'),
    component: StepConfirmation,
    footer: StepConfirmFooter,
    onBack: null,
    hideFooter: false,
  }

  const mcuStep = {
    id: 'updateMCU',
    label: t('app:manager.modal.steps.updateMCU'),
    component: StepFlashMcu,
    footer: null,
    onBack: null,
    hideFooter: true,
  }

  const steps = [updateStep]

  if (firmware.shouldUpdateMcu) {
    steps.push(mcuStep)
  }

  steps.push(finalStep)

  return steps
}

type Props = {
  t: T,
  status: ModalStatus,
  onClose: () => void,
  firmware: Firmware,
  installOsuFirmware: (device: Device) => void,
  installFinalFirmware: (device: Device) => void,
  flashMCU: (device: Device) => void,
  stepId: StepId | string,
}

type State = {
  stepId: StepId | string,
}

class UpdateModal extends PureComponent<Props, State> {
  static defaultProps = {
    stepId: 'idCheck',
  }

  state = {
    stepId: this.props.stepId,
  }

  STEPS = createSteps({ t: this.props.t, firmware: this.props.firmware })

  handleStepChange = (step: Step) => this.setState({ stepId: step.id })

  render(): React$Node {
    const { status, t, firmware, onClose, ...props } = this.props
    const { stepId } = this.state

    const additionalProps = {
      firmware,
      onCloseModal: onClose,
      ...props,
    }

    return (
      <Modal
        onClose={onClose}
        isOpened={status === 'install'}
        refocusWhenChange={stepId}
        preventBackdropClick={false}
        render={() => (
          <Stepper
            title={t('app:manager.firmware.update')}
            initialStepId="idCheck"
            steps={this.STEPS}
            {...additionalProps}
          >
            <SyncSkipUnderPriority priority={100} />
          </Stepper>
        )}
      />
    )
  }
}

export default translate()(UpdateModal)
