import cohen_kappa
import fleiss_kappa
import krippendorff_alpha
import percentage_agreement
import scott_pi
import weighted_kappa
import multilabel_kappa
import sys

try:
    bitmap = sys.argv[1]
    data = sys.argv[2]
    categories = sys.argv[3]
    weights = sys.argv[4]
    result = []
    if bitmap[0] == '1':
        temp = cohen_kappa.main(data)
        result.append("Cohen's Kappa: " + str(round(temp, 3)))  
    if bitmap[1] == '1':
        temp = weighted_kappa.main(data, weights)
        result.append("Weighted Kappa: " + str(round(temp, 3)))  
    if bitmap[2] == '1':
        temp = multilabel_kappa.main(data)
        result.append("Multi-label Kappa: " + str(round(temp, 3)))
        
    if bitmap[3] == '1':
        temp = percentage_agreement.main(data, categories, 'nominal', '')
        result.append("Percentage Agreement: " + str(round(temp, 3)))
    if bitmap[4] == '1':
        temp = percentage_agreement.main(data, categories, 'ordinal', weights)
        result.append("Percentage Agreement (Weighted): " + str(round(temp, 3)))
        
    if bitmap[5] == '1':
        temp = krippendorff_alpha.main(data, categories, 'nominal', '')
        result.append("Krippendorff's Alpha: " + str(round(temp, 3)))
    if bitmap[6] == '1':
        temp = krippendorff_alpha.main(data, categories, 'ordinal', weights)
        result.append("Krippendorff's Alpha (Weighted): " + str(round(temp, 3)))
        
    if bitmap[7] == '1':
        temp = scott_pi.main(data, categories, 'nominal', '')
        result.append("Scott's Pi: " + str(round(temp, 3)))
    if bitmap[8] == '1':
        temp = scott_pi.main(data, categories, 'ordinal', weights)
        result.append("Scott's Pi (Weighted): " + str(round(temp, 3)))
    
    if bitmap[9] == '1':
        temp = fleiss_kappa.main(data, categories, 'nominal', '')
        result.append("Fleiss' Kappa: " + str(round(temp, 3)))
    if bitmap[10] == '1':
        temp = fleiss_kappa.main(data, categories, 'ordinal', weights)
        result.append("Fleiss' Kappa (Weighted): " + str(round(temp, 3)))
    
    print(', '.join(result))
    sys.stdout.flush()
except:
    print('Error: ', sys.exc_info())
    sys.stdout.flush()
    exit(1)

