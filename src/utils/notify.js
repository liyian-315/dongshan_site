import { useIosToast } from '@/composables/useIosToast'
const { open } = useIosToast()

export const notify = {
    success(msg, duration = 3000) { open({ type: 'success', message: msg, duration }) },
    error(msg, duration = 4000)   { open({ type: 'error',   message: msg, duration }) },
    warning(msg, duration = 3500) { open({ type: 'warning', message: msg, duration }) },
    info(msg, duration = 3000)    { open({ type: 'info',    message: msg, duration }) },
}

export const message = notify
