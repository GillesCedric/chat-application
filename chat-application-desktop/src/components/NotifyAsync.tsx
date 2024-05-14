
/**
 * La fonction NotifyAsync est une fonction utilitaire qui facilite la notification asynchrone des résultats d'une fonction asynchrone à l'aide de la bibliothèque react-toastify.
 * Cette fonction prend quatre arguments :
 * - pendingMessage: Le message à afficher pendant que l'opération asynchrone est en cours d'exécution.
 * - successMessage: Le message à afficher si l'opération asynchrone réussit.
 * - errorMessage: Le message à afficher si l'opération asynchrone échoue.
 * - asyncFunction: La fonction asynchrone à exécuter.
 * La fonction toast.promise est utilisée pour afficher une notification basée sur le résultat de l'opération asynchrone. Les paramètres passés à toast.promise incluent le résultat de asyncFunction(), les messages à afficher pour les états de succès, d'attente et d'erreur, ainsi que diverses options de configuration pour le positionnement, la durée de fermeture automatique, la gestion de l'interaction utilisateur et l'apparence visuelle de la notification.
 * 
 * En résumé, la fonction NotifyAsync fournit une manière pratique de gérer les notifications pour les opérations asynchrones, offrant à l'utilisateur des retours d'information clairs sur l'état de ces opérations.
 * 
 * @module components/NotificationAsync
 */





import { Zoom, toast } from "react-toastify";
export const NotifyAsync = (
  pendingMessage: string,
  successMessage: string,
  errorMessage: string,
  asyncFuction: () => Promise<any>
) => {
  toast.promise(
    asyncFuction(),
    {
      pending: pendingMessage,
      success: successMessage,
      error: errorMessage,
    },
    {
      position: "top-right",
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Zoom,
    }
  );
};
