# CrowdTruth ground truth for medical relation extraction

[![DOI](https://zenodo.org/badge/doi/10.5281/zenodo.31890.svg)](http://dx.doi.org/10.5281/zenodo.31890)

NLP often relies on the development of a set of gold standard annotations, or *ground truth*, for the purpose of training, testing and evaluation. *Distant supervision* (1) is a helpful solution that has given linked data sets a lot of attention in NLP, however the data can be noisy. Human annotators can help to clean up this noise, however for Clinical NLP domain knowledge is usually believed to be required from annotators, making the process for acquiring ground truth more difficult. In addition, current methods for collecting annotation attempt to minimize disagreement between annotators, and therefore fail to model the ambiguity inherent in language. The lack of annotated datasets for training and benchmarking is therefore one of the main challenges of Clinical Natural Language Processing.

We propose the **[CrowdTruth](http://crowdtruth.org/)** method for collecting medical ground truth through crowdsourcing, based on the observation that disagreement between annotators can be used to capture ambiguity in text. This repository contains a ground truth corpus for medical relation extraction, acquired with crowdsourcing and processed with **[CrowdTruth](http://crowdtruth.org/)** metrics.

More details about the corpus can be found in the papers:

* Anca Dumitrache, Lora Aroyo, Chris Welty: **[CrowdTruth Measures for Language Ambiguity: The Case of Medical Relation Extraction](http://www.ancad.ro/2015/09/01/crowdtruth-measures-for-language-ambiguity)**. [LD4IE](http://oak.dcs.shef.ac.uk/ld4ie2015/LD4IE2015/Overview.html) at [ISWC 2015](http://iswc2015.semanticweb.org/).
* Anca Dumitrache, Lora Aroyo, Chris Welty: **[Achieving Expert-Level Annotation Quality with CrowdTruth: The Case of Medical Relation Extraction](http://www.ancad.ro/2015/08/14/achieving-expert-level-annotation-quality-with-crowdtruth/)**. [BDM2I](https://sbmi.uth.edu/ontology/bdm2i.htm) at [ISWC 2015](http://iswc2015.semanticweb.org/).

## Dataset files

```
|--cause_relation_ground_truth.csv
```
This file contains the processed ground truth for the medical *cause* relation, in comma-separated format. The columns are:
* *Sent_id*: unique ID of the data entry
* *sentence*: medical sentence
* *term1, term2*: the 2 medical terms after correction with *FactSpan* and *RelDir*; together, they express the relation: ```term1 cause of term2```
* *b1, b2*: the beginning position of each term in the sentence
* *e1, e2*: the end position of each term in the sentence
* *senrel_score*: the sentence relation score of the *cause* relation; using cosine similarity over the aggregated crowd data, it computes the likelihood that *cause* is expressed between the 2 terms in the sentence
* *crowd*: the score used to train the relation extraction classifier with crowd data; it is the sentence-relation score, with a threshold to select positive and negative examples equal to 0.5, and rescaled in [0.85, 1] for positives, and [-1, -0.85] for negatives.
* *single*: discrete labels for every sentence are taken from one randomly selected crowd worker who annotated the sentence.
* *baseline*: discrete (positive or negative) labels are given for each sentence by the distant supervision (1) method
* *expert*: discrete labels based on an expert’s judgment as to whether the *baseline* label is correct
* *test_eval*: manual evaluation scores over the sentences where *crowd* and *expert* disagreed, used for evaluating the classifier; the sentence-relation score threshold was set at 0.7 for maximum agreement; sentences scored with 0 were determined to be ambiguous and were removed from testing
* *distant supervision term 1, distant supervision term 2*: the original terms as extracted by distant supervision, before correction with *FactSpan*
* *UMLS seed relation*: the UMLS (4) relation used as a seed in distant supervision to find the given entry

```
|--/raw
| |--/FactSpan
| |--/RelEx
| |--/RelDir
```
The raw data collected from crowdsourcing for each of the 3 tasks.

```
|--/aggregate
```
Various aggregated datasets collected as part of the classifier evaluation.


## Experimental setup

### Data

The dataset used in our experiments contains 902 medical sentences extracted from PubMed article abstracts. The MetaMap parser (2) ran over the corpus to identify medical terms from the UMLS vocabulary (3). Distant supervision (1) was used to select sentences with pairs of terms that are linked in UMLS by one of our chosen seed medical relations. The intuition of distant supervision is that since we know the terms are related, and they are in the same sentence, it is more likely that the sentence expresses a relation between them. The seed relations were restricted to a set of eleven UMLS relations important for clinical decision making.

For collecting annotations from medical experts, we employed medical students, in their third year at American universities, that had just taken United States Medical Licensing Examination (USMLE) and were waiting for their results. Each sentence was annotated by exactly one person. The annotation task consisted of deciding whether or not the UMLS seed relation discovered by distant supervision is present in the sentence for the two selected terms.

### Crowdsourcing

![Fig.1: CrowdTruth Workflow for Medical Relation Extraction on CrowdFlower.](https://raw.githubusercontent.com/CrowdTruth/Medical-Relation-Extraction/master/img/task_workflow_2.png)

The crowdsourced annotation is performed in a workflow of three tasks. The sentences were pre-processed to determine whether the terms found with distant supervision are complete or not; identifying complete medical terms is difficult, and the automated method left a number of terms still incomplete, which was a significant source of error for the crowd in subsequent stages, so the incomplete terms were sent through a crowdsourcing task (*FactSpan*) in order to get the full word span of the medical terms. Next, the sentences with the corrected term spans were sent to a relation extraction task (*RelEx*), where the crowd was asked to decide which relation holds between the two extracted terms. The workers were able to read the definition of each relation, and could choose any number of relations per sentence. Finally, the results from *RelEx* were passed to another crowdsourcing task (*RelDir*) to determine the direction of the relation with regards to the two extracted terms. (*FactSpan* and *RelDir*) were added to the basic *RelEx* task to correct the most common sources of errors from the crowd.

### Relation extraction classifier

The sentences together with the relation annotations were then used to train a manifold model for relation extraction (4). This model was developed for the medical domain, and tested for the relation set that we employ. It is trained per individual relation, by feeding it both positive and negative data. It offers support for both discrete labels, and real values for weighting the confidence of the training data entries, with positive values in (0,1], and negative values in [-1,0). 


## References

(1) Mintz, M., Bills, S., Snow, R., Jurafsky, D.: *Distant supervision for relation extraction without labeled data*. In: Joint Conference of the 47th Annual Meeting of the ACL and the 4th International Joint Conference on Natural Language Processing of the AFNLP: Volume 2. pp. 1003–1011. Association for Computational Linguistics (2009).

(2) Aronson, A.R.: Effective mapping of biomedical text to the UMLS Metathesaurus: the MetaMap program. In: Proceedings of the AMIA Symposium. p. 17. American Medical Informatics Association (2001).

(3) Bodenreider, O.: The unified medical language system (UMLS): integrating biomedical terminology. Nucleic acids research 32(suppl 1), D267–D270 (2004).

(4) Wang, C., Fan, J.: Medical relation extraction with manifold models. In: 52nd Annual Meeting of the ACL, vol. 1. pp. 828–838. ACL (2014).