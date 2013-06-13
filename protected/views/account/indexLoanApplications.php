<h1><?php echo Yii::t('Account', 'IndexLoanApplications'); ?></h1>

<table>
    <tr>
        <th><?php echo Yii::t('Loan', 'ApplicationCreated'); ?></th>
        <th><?php echo Yii::t('Loan', 'Amount'); ?></th>
        <th><?php echo Yii::t('Loan', 'Type'); ?></th>
        <th><?php echo Yii::t('Loan', 'Repayment'); ?></th>
        <th><?php echo Yii::t('Loan', 'Interest'); ?></th>
        <th><?php echo Yii::t('Loan', 'Interval'); ?></th>
    </tr>
    
    <?php
        foreach($loanApplications as $loanApplication){
            echo "<tr>";
                echo "<td>".Format::formatISODateToEUROFormat($loanApplication->create_date)."</td>";
                echo "<td>$loanApplication->amount</td>";
                echo "<td>".Yii::t('Loan',$loanApplication->type)."</td>";
                echo "<td>$loanApplication->repayment</td>";
                echo "<td>".number_format($loanApplication->interest,3)." %</td>";
                echo "<td>".Yii::t('Loan',$loanApplication->interval)."</td>";
            echo "</tr>";
        }
    ?>
</table>

<div class="row buttons">
    <?php $this->widget('bootstrap.widgets.TbButton', array('url'=>'createLoanApplication', 'label'=>Yii::t('Account', 'CreateLoanApplication'))); ?>
</div>