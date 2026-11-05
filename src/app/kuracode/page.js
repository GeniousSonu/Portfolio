import { permanentRedirect } from 'next/navigation';

export default function KuracodeRootRedirect() {
  permanentRedirect('/extensions/kuracode');
}
