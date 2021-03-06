<?php
/**
 * Creates a new model.
 * If creation is successful, the browser will be redirected to the 'view' page.
 */
class CreateAction extends CAction
{
    public function run()
    {
            $controller=$this->getController();
            
            $accountTransaction=new AccountTransaction;
            if(isset($_POST['AccountTransaction'])){
                $accountTransaction->attributes=$_POST['AccountTransaction'];
            }
            $accountTransaction->form_step = $this->getFormStep();

            // Step 1 (give IBAN)
            if($accountTransaction->form_step === 1){
                if(isset($accountTransaction->recipient_iban)){
                    $accountTransaction->scenario = 'stepOne';
                    if($accountTransaction->validate() AND $accountTransaction->form_step===1){
                        $controller->redirect(array('create','recipient_iban'=>$accountTransaction->recipient_iban));
                    }
                }
                
                $controller->render('create',array(
                'accountTransaction'=>$accountTransaction,
                ));
            }
            elseif($accountTransaction->form_step === 2){
                $accountTransaction->scenario = 'stepTwo';
                $ibanDropdown = $controller->getIbanDropdown();
                
                // Predefined values
                if(!isset($accountTransaction->recipient_iban)) $accountTransaction->recipient_iban=$_GET['recipient_iban'];
                $accountTransaction->recipient_bic = BICComponent::getBICFromIBAN($accountTransaction->recipient_iban);
                $accountTransaction->payer_bic = BICComponent::getBICFromIBAN($accountTransaction->payer_iban);
                if(!isset($accountTransaction->event_date)) $accountTransaction->event_date=date('d.m.Y');
                // @TODO: multi-currency options
                $accountTransaction->exchange_rate=1;
                $accountTransaction->currency="EUR";
                
                $accountTransaction->recipient_iban = preg_replace('/\s+/', '', $accountTransaction->recipient_iban);
                $accountTransaction->reference_number = preg_replace('/\s+/', '', $accountTransaction->reference_number);
                                           
                if(isset($accountTransaction->payer_iban)){
                    $accountTransaction->validate();
                    // Don't allow to create transactions to other users accounts with post-injection
                    if($accountTransaction->payerIban->bank_user_id == Yii::app()->user->id ){
                        if($accountTransaction->save()) $controller->redirect(array('view','id'=>$accountTransaction->id));
                    }
                }
                
                $controller->render('create',array(
                'accountTransaction'=>$accountTransaction,
                'ibanDropdown'=>$ibanDropdown,
                ));
            }
    }
    
    /**
     * Gets the current form step
     */
    private function getFormStep(){
        $form_step = 1;
        
        if(isset($_GET['recipient_iban'])) $form_step=2;
        else $form_step=1;
     
        return $form_step;
    }
    
}
?>
