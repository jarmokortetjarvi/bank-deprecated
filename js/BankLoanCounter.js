$(document).ready(function(){ 
    
    getIntervalInDays = function(loanInterval){
        var loanIntervalInDays;

        if(loanInterval == "day"){ loanIntervalInDays = 1; }
        else if(loanInterval == "week"){ loanIntervalInDays = 7; }
        else if(loanInterval == "month"){ loanIntervalInDays = 30; }
        else if(loanInterval == "year"){ loanIntervalInDays = 365; }
        else { loanIntervalInDays = 0; }

        return loanIntervalInDays;
    }
    
    getLoanInterestPart = function(interest, loanIntervalInDays){    
        var interestDaily = interest / 360;
        var interestPart = interestDaily * loanIntervalInDays;
        
        return interestPart;
    }
    
    getIntervalInDays = function( term ){
        var intervalInDays;

        if(term == "day"){ intervalInDays = 1; }
        else if(term == "week"){ intervalInDays = 7; }
        else if(term == "month"){ intervalInDays = 30; }
        else if(term == "year"){ intervalInDays = 360; }
        else{ intervalInDays = 0; }

        return intervalInDays; 
    };
    
    getTermInDays = function(){
        var term = $("#Loan_term_interval option:selected").val();
        var termInDays;

        if(term == "days"){ termInDays = 1; }
        else if(term == "weeks"){ termInDays = 7; }
        else if(term == "months"){ termInDays = 30; }
        else if(term == "years"){ termInDays = 360; }
        else{ termInDays = 0; }

        return termInDays;
    };
    
    formatLoanTermToHumanReadable = function( loanTermInDays, loanType ){
        if(loanType=='annuity'){
            var loanInterval = $("#Loan_term_interval option:selected").val().slice(0,-1);
        }
        else var loanInterval = $("#Loan_interval option:selected").val();
        
        var loanIntervalInDays = getIntervalInDays(loanInterval);
        
        term = Math.ceil( loanTermInDays * loanIntervalInDays);

        var years = 0;
        var months = 0;
        var days = 0;

        // Years
        if( loanInterval == "year" ){
            years = Math.ceil(term / 360);
        }
        else{
            years = Math.floor(term / 360);
        }
        term -= years * 360;

        // Months
        if( loanInterval == "day" ){
            months = Math.floor(term / 30);
        }
        else{
            months = Math.ceil(term / 30);
            if(months >= 12){ // Months are 12 after rounding
                years++;
                months -= 12;
                term -= 360;
            }
        }

        term -= months * 30;
        // Days
        if(term > 0){
            days = Math.ceil(term);
        }

        // Formatting
        // @TODO: get translations
        prettyTerm = "";
        if( years > 0){
        var intervalText = $("#Loan_term_interval option[value='years']").text();
            prettyTerm += years + " " + intervalText + " ";
        }
        if( months > 0){
        var intervalText = $("#Loan_term_interval option[value='months']").text();
            prettyTerm += months + " " + intervalText + " ";
        }
        if( days > 0){
        intervalText = $("#Loan_term_interval option[value='days']").text();
            prettyTerm += days + " " + intervalText;
        }
		
        return prettyTerm;
    }
    
    loanCounter = function(){
        // Get variables
        var loanAmount = $("#Loan_amount").val();
        var loanType = $("#Loan_type option:selected").val();
        var loanRepayment = $("#Loan_repayment");
        var loanInstalment = $("#Loan_instalment");
        var loanInterval = $("#Loan_interval").val();
        var loanTermInterval = $("#Loan_term_interval option:selected").val();
        var interestType = $("#Loan_bank_interest_id option:selected").val();
        var loanInterest = $("#Loan_bank_interest_id option:selected").text().match(/[0-9][.][0-9]+/) / 100; 
        
        var loanIntervalInDays = getIntervalInDays(loanInterval);
        var loanInterestPart = getLoanInterestPart(loanInterest, loanIntervalInDays);
     
        var realAmount = fillPaymentPlan(loanAmount, loanInterestPart, loanIntervalInDays);
        var loanTerm = $("#Loan_term option:selected").text();
        var prettyLoanTerm = formatLoanTermToHumanReadable( loanTerm, loanType );
        fillLoanCounter(loanAmount, realAmount, prettyLoanTerm);
    }
    
    loanCounter();
	
    $("#createLoanApplicationForm input").keyup(function(){
        loanCounter();	
    });
    $("#createLoanApplicationForm select").change(function(){
        loanCounter();
    });
});